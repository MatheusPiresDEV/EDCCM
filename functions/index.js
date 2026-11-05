const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

initializeApp();

const db = getFirestore();
const auth = getAuth();
const USER_PROFILES = 'usuarios';
const PRIMARY_ADMIN_EMAIL = 'matheusgustavodasilvapires@gmail.com';

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

async function requireAdmin(request) {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Faça login para administrar as contas.');
  }

  if (normalizeEmail(request.auth.token.email) === PRIMARY_ADMIN_EMAIL) return;

  const callerProfile = await db.collection(USER_PROFILES).doc(request.auth.uid).get();
  if (!callerProfile.exists || String(callerProfile.get('role') || '').toLowerCase() !== 'admin') {
    throw new HttpsError('permission-denied', 'Acesso de administrador obrigatório.');
  }
}

async function getTarget(uid) {
  if (typeof uid !== 'string' || !uid.trim()) {
    throw new HttpsError('invalid-argument', 'Identificador de usuário inválido.');
  }

  const profileRef = db.collection(USER_PROFILES).doc(uid);
  const [profileSnapshot, authUser] = await Promise.all([
    profileRef.get(),
    auth.getUser(uid).catch((error) => {
      if (error.code === 'auth/user-not-found') {
        throw new HttpsError('not-found', 'Conta de autenticação não encontrada.');
      }
      throw error;
    })
  ]);
  if (!profileSnapshot.exists) {
    throw new HttpsError('not-found', 'Perfil de usuário não encontrado.');
  }

  return { profileRef, profile: profileSnapshot.data(), authUser };
}

function isProtectedAdmin(profile, authUser) {
  return normalizeEmail(profile?.email) === PRIMARY_ADMIN_EMAIL ||
    normalizeEmail(authUser?.email) === PRIMARY_ADMIN_EMAIL;
}

function validateRole(role) {
  if (role !== 'admin' && role !== 'user') {
    throw new HttpsError('invalid-argument', 'Nível de acesso inválido.');
  }
  return role;
}

exports.gerenciarUsuarioAdmin = onCall(async (request) => {
  await requireAdmin(request);
  const data = request.data || {};
  const action = data.action;

  try {
    if (action === 'create') {
      const email = normalizeEmail(data.email);
      const password = data.password;
      const role = validateRole(data.role);
      if (!email || typeof password !== 'string' || password.length < 6) {
        throw new HttpsError('invalid-argument', 'Informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
      }

      const createdUser = await auth.createUser({ email, password });
      try {
        const now = FieldValue.serverTimestamp();
        await db.collection(USER_PROFILES).doc(createdUser.uid).set({
          uid: createdUser.uid,
          email: createdUser.email || email,
          role,
          criadoEm: now,
          atualizadoEm: now,
          ultimoLogin: now
        });
      } catch (error) {
        await auth.deleteUser(createdUser.uid).catch((rollbackError) => {
          console.error('Falha ao reverter a criação da conta:', rollbackError);
        });
        throw error;
      }
      return { uid: createdUser.uid, email: createdUser.email, role };
    }

    if (action === 'update') {
      const uid = data.uid;
      const email = normalizeEmail(data.email);
      const role = validateRole(data.role);
      const password = data.password;
      if (!email) throw new HttpsError('invalid-argument', 'Informe um e-mail válido.');
      if (password !== undefined && password !== null && password !== '' &&
        (typeof password !== 'string' || password.length < 6)) {
        throw new HttpsError('invalid-argument', 'A senha precisa ter pelo menos 6 caracteres.');
      }

      const target = await getTarget(uid);
      const protectedAdmin = isProtectedAdmin(target.profile, target.authUser);
      if (protectedAdmin && (email !== PRIMARY_ADMIN_EMAIL || role !== 'admin')) {
        throw new HttpsError('failed-precondition', 'O e-mail e o nível de administrador da conta principal são imutáveis.');
      }
      if (uid === request.auth.uid && protectedAdmin && role !== 'admin') {
        throw new HttpsError('failed-precondition', 'A conta principal não pode ser rebaixada.');
      }

      const emailFinal = protectedAdmin ? PRIMARY_ADMIN_EMAIL : email;
      const profileAnterior = target.profile;
      const authChanges = {};
      if (normalizeEmail(target.authUser.email) !== emailFinal) authChanges.email = emailFinal;
      if (typeof password === 'string' && password.length) authChanges.password = password;

      await target.profileRef.set({
        ...profileAnterior,
        uid,
        email: emailFinal,
        role: protectedAdmin ? 'admin' : role,
        atualizadoEm: FieldValue.serverTimestamp()
      });

      try {
        if (Object.keys(authChanges).length) await auth.updateUser(uid, authChanges);
      } catch (error) {
        try {
          await target.profileRef.set(profileAnterior);
        } catch (rollbackError) {
          console.error('Falha ao reverter o perfil após erro no Firebase Auth:', rollbackError);
        }
        throw error;
      }

      return { uid, email: emailFinal, role: protectedAdmin ? 'admin' : role };
    }

    if (action === 'delete') {
      const uid = data.uid;
      if (uid === request.auth.uid) {
        throw new HttpsError('failed-precondition', 'Não é possível excluir a própria conta pelo painel.');
      }

      const target = await getTarget(uid);
      if (isProtectedAdmin(target.profile, target.authUser)) {
        throw new HttpsError('failed-precondition', 'A conta principal de administrador é imune à exclusão.');
      }

      await target.profileRef.delete();
      try {
        await auth.deleteUser(uid);
      } catch (error) {
        try {
          await target.profileRef.set(target.profile);
        } catch (rollbackError) {
          console.error('Falha ao restaurar o perfil após erro na exclusão da conta:', rollbackError);
        }
        throw error;
      }
      return { uid, deleted: true };
    }

    throw new HttpsError('invalid-argument', 'Operação de administração inválida.');
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.error('Erro na operação de gerenciamento de usuário:', error);
    throw new HttpsError('internal', 'Não foi possível concluir a operação da conta.');
  }
});
