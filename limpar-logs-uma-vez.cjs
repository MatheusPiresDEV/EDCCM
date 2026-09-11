// Script temporario: execute uma unica vez com credenciais administrativas.
// Requer: npm install firebase-admin
// Configure GOOGLE_APPLICATION_CREDENTIALS apontando para a chave privada do projeto.

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function limparLogs() {
  const snapshot = await db.collection('logs').get();

  for (let inicio = 0; inicio < snapshot.docs.length; inicio += 450) {
    const batch = db.batch();
    snapshot.docs.slice(inicio, inicio + 450).forEach((documento) => {
      batch.delete(documento.ref);
    });
    await batch.commit();
  }

  console.log(`${snapshot.size} documento(s) removido(s) da colecao logs.`);
}

limparLogs().catch((erro) => {
  console.error('Falha ao limpar a colecao logs:', erro);
  process.exitCode = 1;
});
