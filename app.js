import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, updatePassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, getDoc, setDoc, serverTimestamp, arrayUnion, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCITjA6Cba4uvfFFa8U7eeZSeq5EaGzZOU",
  authDomain: "avaliacoes-7e83e.firebaseapp.com",
  projectId: "avaliacoes-7e83e",
  storageBucket: "avaliacoes-7e83e.firebasestorage.app",
  messagingSenderId: "135681111399",
  appId: "1:135681111399:web:87f93c9f3ff286864cebc2",
  measurementId: "G-DSFJNLGWQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LISTA DE FRASES PARA A LOCKSCREEN
const FRASES = [
  { quote: "Combata o fogo com fogo, o fim está próximo", autor: "Metallica, 1984 (Fight Fire with Fire)" },
  { quote: "O homem está condenado a ser livre", autor: "Jean-Paul Sartre, 1943 (O Ser e o Nada)" },
  { quote: "Gritem para mim, Brasil!", autor: "Iron Maiden, 1993 (A Real Live One)" },
  { quote: "Aquele que luta com monstros deve acautelar-se para não tornar-se também um monstro", autor: "Friedrich Nietzsche, 1886" },
  { quote: "Há uma senhora que tem certeza de que tudo o que reluz é ouro", autor: "Led Zeppelin, 1971 (Stairway to Heaven)" },
  { quote: "Conhece-te a ti mesmo", autor: "Sócrates, c. 400 a.C." },
  { quote: "Olá, há alguém aí dentro? Apenas acene se puder me ouvir", autor: "Pink Floyd, 1979 (Comfortably Numb)" },
  { quote: "A vida não examinada não vale a pena ser vivida", autor: "Sócrates, 399 a.C." },
  { quote: "Atravesse para o outro lado", autor: "The Doors, 1967 (Break On Through)" },
  { quote: "Penso, logo existo", autor: "René Descartes, 1637" },
  { quote: "Mestre dos fantoches, estou puxando os seus cordões", autor: "Metallica, 1986 (Master of Puppets)" },
  { quote: "O homem é o lobo do homem", autor: "Thomas Hobbes, 1651" },
  { quote: "Corram para as colinas, corram por suas vidas", autor: "Iron Maiden, 1982 (Run to the Hills)" },
  { quote: "Tudo flui, nada permanece", autor: "Heráclito, c. 500 a.C." },
  { quote: "Somos apenas duas almas perdidas nadando num aquário, ano após ano", autor: "Pink Floyd, 1975 (Wish You Were Here)" },
  { quote: "Na vida política, a liberdade é a própria vida", autor: "Hannah Arendt, 1961" },
  { quote: "Existem coisas conhecidas e coisas desconhecidas, e entre elas estão as portas", autor: "Jim Morrison / The Doors" },
  { quote: "Viver sem filosofar é exatamente o mesmo que ter os olhos fechados", autor: "René Descartes, 1644" },
  { quote: "Viver é morrer", autor: "Metallica, 1988 (To Live Is to Die)" },
  { quote: "Deus está morto", autor: "Friedrich Nietzsche, 1882" },
  { quote: "Conforme você amaldiçoa o dedo acusador, ele aponta de volta para você", autor: "Iron Maiden, 1988" },
  { quote: "Onde não há lei, não há liberdade", autor: "John Locke, 1689" },
  { quote: "No fim de tudo, é apenas mais um tijolo na parede", autor: "Pink Floyd, 1979" },
  { quote: "Não se nasce mulher, torna-se mulher", autor: "Simone de Beauvoir, 1949" },
  { quote: "Mantenha seus olhos na estrada, suas mãos no volante", autor: "The Doors, 1970 (Roadhouse Blues)" },
  { quote: "O sofrimento é o próprio elemento da vida", autor: "Arthur Schopenhauer, 1818" },
  { quote: "E ela está comprando uma escadaria para o céu", autor: "Led Zeppelin, 1971" },
  { quote: "A razão é, e deve ser apenas, a escrava das paixões", autor: "David Hume, 1739" },
  { quote: "Triste, mas verdadeiro", autor: "Metallica, 1991 (Sad But True)" },
  { quote: "O inferno são os outros", autor: "Jean-Paul Sartre, 1944" },
  { quote: "A sua hora vai chegar", autor: "Iron Maiden, 2000 (The Wicker Man)" },
  { quote: "A felicidade não é um ideal da razão, mas sim da imaginação", autor: "Immanuel Kant, 1785" },
  { quote: "Sinto uma sensação quando olho para o oeste", autor: "Led Zeppelin, 1971" },
  { quote: "Tudo o que é sólido se desmancha no ar", autor: "Karl Marx e Friedrich Engels, 1848" },
  { quote: "Brilhe, seu diamante louco", autor: "Pink Floyd, 1975" },
  { quote: "O verdadeiro conhecimento é saber a extensão da própria ignorância", autor: "Confúcio, c. 500 a.C." },
  { quote: "Cavaleiros na tempestade, dentro desta casa nós nascemos", autor: "The Doors, 1971" },
  { quote: "A dúvida é o princípio da sabedoria", autor: "Aristóteles, c. 330 a.C." },
  { quote: "Saia luz, entre noite, pegue a minha mão", autor: "Metallica, 1991 (Enter Sandman)" },
  { quote: "Sabemos o que somos, mas não o que podemos ser", autor: "William Shakespeare, 1603" },
  { quote: "Medo do escuro, tenho um medo constante de que algo esteja sempre por perto", autor: "Iron Maiden, 1992" },
  { quote: "Agir de tal modo que a máxima da sua ação se possa tornar numa lei universal", autor: "Immanuel Kant, 1785" },
  { quote: "A música continua a mesma", autor: "Led Zeppelin, 1973" },
  { quote: "Se queres prever o futuro, estuda o passado", autor: "Confúcio, c. 500 a.C." },
  { quote: "Dinheiro, vá embora, consiga um bom emprego com maior salário", autor: "Pink Floyd, 1973" },
  { quote: "O homem nasce livre, e por toda a parte encontra-se a ferros", autor: "Jean-Jacques Rousseau, 1762" },
  { quote: "Este é o fim, linda amiga", autor: "The Doors, 1967 (The End)" },
  { quote: "A sabedoria começa na reflexão", autor: "Sócrates, c. 400 a.C." },
  { quote: "Nada mais importa", autor: "Metallica, 1991 (Nothing Else Matters)" },
  { quote: "A beleza salvará o mundo", autor: "Fiódor Dostoiévski, 1869" }
];

// IMAGENS DA PASTA ASSETS PARA O LOCKSCREEN
const IMAGENS_LOCKSCREEN = [
  'assets/andjustice.jpg',
  'assets/images (2).jfif',
  'assets/yh43bx8tdof21.jpg'
];

// LÓGICA DO RELÓGIO E TELA DE BLOQUEIO
function atualizarRelogioLockscreen() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');

  document.getElementById('lock-hora').innerText = `${horas}:${minutos}:${segundos}`;

  const opcoesData = { weekday: 'long', day: 'numeric', month: 'long' };
  document.getElementById('lock-data').innerText = agora.toLocaleDateString('pt-BR', opcoesData);
}
setInterval(atualizarRelogioLockscreen, 1000);
atualizarRelogioLockscreen();

window.desbloquearTela = function() {
  const lockscreen = document.getElementById('lockscreen');
  const auth = document.getElementById('sec-auth');

  if (auth) {
    auth.classList.remove('escondido');
  }

  document.querySelectorAll('.tela').forEach((tela) => {
    if (tela.id !== 'sec-auth') {
      tela.classList.add('escondido');
    }
  });

  if (lockscreen) {
    lockscreen.classList.remove('escondido');
    lockscreen.classList.add('deslizar-up');
    lockscreen.style.backgroundImage = 'none';
    lockscreen.style.background = 'linear-gradient(180deg, rgba(2, 6, 23, 0.24), rgba(2, 6, 23, 0.5))';
    lockscreen.style.filter = 'blur(12px) brightness(0.7)';
    lockscreen.style.opacity = '0.25';
  }
};

window.bloquearTela = function() {
  sortearFraseELockscreen();
  const lockscreen = document.getElementById('lockscreen');
  const auth = document.getElementById('sec-auth');
  const mainHeader = document.getElementById('main-header');

  if (auth) {
    auth.classList.add('escondido');
  }

  if (mainHeader) {
    mainHeader.classList.add('escondido');
  }

  document.querySelectorAll('.tela').forEach((tela) => {
    if (tela.id !== 'sec-auth' && tela.id !== 'lockscreen') {
      tela.classList.add('escondido');
    }
  });

  if (lockscreen) {
    lockscreen.classList.remove('deslizar-up');
    lockscreen.classList.remove('escondido');
    lockscreen.style.filter = 'blur(0px) brightness(1)';
    lockscreen.style.opacity = '1';
    lockscreen.style.pointerEvents = 'auto';
    lockscreen.style.display = 'flex';
  }
};

function mostrarWallpaperPrincipal() {
  const lockscreen = document.getElementById('lockscreen');
  if (lockscreen) {
    lockscreen.classList.add('deslizar-up');
    lockscreen.style.filter = 'blur(0px) brightness(1)';
    lockscreen.style.opacity = '0';
    lockscreen.style.pointerEvents = 'none';
  }
}

function sortearFraseELockscreen() {
  const f = FRASES[Math.floor(Math.random() * FRASES.length)];
  const lockscreen = document.getElementById('lockscreen');

  if (!lockscreen) return;

  document.getElementById('lock-quote-texto').innerText = `"${f.quote}"`;
  document.getElementById('lock-quote-autor').innerText = `- ${f.autor}`;

  lockscreen.style.backgroundImage = 'none';
  lockscreen.style.background = 'linear-gradient(180deg, rgba(2, 6, 23, 0.24), rgba(2, 6, 23, 0.5))';
  lockscreen.style.filter = 'blur(0px) brightness(1)';
}
sortearFraseELockscreen();
bloquearTela();

const lockscreenEl = document.getElementById('lockscreen');
if (lockscreenEl) {
  lockscreenEl.addEventListener('click', () => {
    window.desbloquearTela();
  });
}

const btnVoltarLock = document.getElementById('btn-voltar-lock');
if (btnVoltarLock) {
  btnVoltarLock.addEventListener('click', () => {
    window.bloquearTela();
  });
}

// WALLPAPER REATIVO AO HORÁRIO E INTERATIVO (CANVAS)
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function redimensionarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

// PARTÍCULAS INTERATIVAS DO WALLPAPER
const particulas = Array.from({ length: 90 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  raio: Math.random() * 2.4 + 0.8,
  vx: (Math.random() - 0.5) * 0.6,
  vy: (Math.random() - 0.5) * 0.6,
  brilho: Math.random() * 0.8 + 0.2
}));

function interpolar(inicio, fim, fator) {
  return inicio + (fim - inicio) * fator;
}

function obterCenaDoDia() {
  const agora = new Date();
  const hora = agora.getHours() + agora.getMinutes() / 60;

  if (hora >= 5 && hora < 8) return 'nascer';
  if (hora >= 8 && hora < 16) return 'dia';
  if (hora >= 16 && hora < 20) return 'por-do-sol';
  return 'noite';
}

function animarFundo() {
  const agora = new Date();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const cena = obterCenaDoDia();
  const larg = canvas.width;
  const alt = canvas.height;
  const pontoFugaX = larg * (0.5 + (mouse.x / larg - 0.5) * 0.18);
  const pontoFugaY = alt * (0.44 + (mouse.y / alt - 0.5) * 0.1);

  ctx.clearRect(0, 0, larg, alt);

  let topo1, topo2, meio1, meio2, solCor, solX, solY, solRaio, horizonte, nuvem, estrela, montanha1, montanha2, montanha3;

  if (cena === 'nascer') {
    topo1 = '#081f3f';
    topo2 = '#2d5b88';
    meio1 = '#f7b267';
    meio2 = '#f9d976';
    solCor = '#fff2b3';
    solX = larg * 0.3 + (hora - 5) * larg * 0.1;
    solY = alt * (0.78 - (hora - 5) * 0.1);
    solRaio = 48;
    horizonte = '#f4c77d';
    nuvem = 'rgba(255, 245, 220, 0.14)';
    estrela = 'rgba(255, 239, 197, 0.18)';
    montanha1 = '#1d3557';
    montanha2 = '#0f2542';
    montanha3 = '#0b1b2f';
  } else if (cena === 'dia') {
    topo1 = '#62b6ff';
    topo2 = '#d7f1ff';
    meio1 = '#8bd4ff';
    meio2 = '#f6fbff';
    solCor = '#ffe38a';
    solX = larg * (0.18 + (hora - 8) / 8 * 0.64);
    solY = alt * 0.28;
    solRaio = 42;
    horizonte = '#a5d8ff';
    nuvem = 'rgba(255, 255, 255, 0.18)';
    estrela = 'rgba(255, 255, 255, 0.06)';
    montanha1 = '#4a6f8a';
    montanha2 = '#3a536e';
    montanha3 = '#243a4d';
  } else if (cena === 'por-do-sol') {
    topo1 = '#2d1b4a';
    topo2 = '#ef6f6c';
    meio1 = '#ff9f43';
    meio2 = '#ffd166';
    solCor = '#ffcf70';
    solX = larg * (0.72 - (hora - 16) / 4 * 0.42);
    solY = alt * (0.34 + (hora - 16) / 4 * 0.14);
    solRaio = 54;
    horizonte = '#ff8a5b';
    nuvem = 'rgba(255, 214, 160, 0.14)';
    estrela = 'rgba(255, 255, 255, 0.08)';
    montanha1 = '#4c3259';
    montanha2 = '#2d2240';
    montanha3 = '#1b1a2f';
  } else {
    topo1 = '#020b1a';
    topo2 = '#112942';
    meio1 = '#1f3a5f';
    meio2 = '#3f5d8a';
    solCor = '#dfe9ff';
    solX = larg * 0.7;
    solY = alt * 0.32;
    solRaio = 38;
    horizonte = '#7e9cc7';
    nuvem = 'rgba(180, 210, 255, 0.08)';
    estrela = 'rgba(255, 255, 255, 0.45)';
    montanha1 = '#13263f';
    montanha2 = '#0e1f34';
    montanha3 = '#081523';
  }

  const gradiente = ctx.createLinearGradient(0, 0, 0, alt);
  gradiente.addColorStop(0, topo1);
  gradiente.addColorStop(0.5, meio1);
  gradiente.addColorStop(1, topo2);
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, larg, alt);

  const gradienteSol = ctx.createRadialGradient(solX, solY, 10, solX, solY, solRaio * 3.5);
  gradienteSol.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradienteSol.addColorStop(0.18, solCor);
  gradienteSol.addColorStop(0.55, 'rgba(255,170,90,0.25)');
  gradienteSol.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.fillStyle = gradienteSol;
  ctx.beginPath();
  ctx.arc(solX, solY, solRaio * 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = solCor;
  ctx.beginPath();
  ctx.arc(solX, solY, solRaio, 0, Math.PI * 2);
  ctx.fill();

  if (cena === 'noite') {
    particulas.forEach((p, index) => {
      const estrelaX = (p.x + (index * 17)) % larg;
      const estrelaY = (p.y + (index * 13)) % (alt * 0.7);
      ctx.fillStyle = `rgba(255,255,255,${p.brilho})`;
      ctx.beginPath();
      ctx.arc(estrelaX, estrelaY, p.raio, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  for (let i = 0; i < 6; i++) {
    const desloc = (Date.now() * 0.02 + i * 160) % (larg + 260);
    const nuvemY = alt * (0.18 + i * 0.05) + (mouse.y - alt / 2) * 0.03;
    ctx.fillStyle = nuvem;
    ctx.beginPath();
    ctx.arc(desloc - 120, nuvemY, 42, 0, Math.PI * 2);
    ctx.arc(desloc - 70, nuvemY - 18, 50, 0, Math.PI * 2);
    ctx.arc(desloc - 20, nuvemY, 58, 0, Math.PI * 2);
    ctx.arc(desloc + 40, nuvemY - 12, 48, 0, Math.PI * 2);
    ctx.fill();
  }

  const horizonteBase = alt * 0.72;
  ctx.beginPath();
  ctx.moveTo(0, alt);
  ctx.lineTo(0, horizonteBase);
  ctx.lineTo(larg * 0.15, horizonteBase - 40);
  ctx.lineTo(larg * 0.32, horizonteBase + 5);
  ctx.lineTo(larg * 0.45, horizonteBase - 60);
  ctx.lineTo(larg * 0.62, horizonteBase + 8);
  ctx.lineTo(larg * 0.8, horizonteBase - 45);
  ctx.lineTo(larg, horizonteBase);
  ctx.lineTo(larg, alt);
  ctx.closePath();
  ctx.fillStyle = montanha1;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, alt);
  ctx.lineTo(0, horizonteBase + 10);
  ctx.lineTo(larg * 0.2, horizonteBase - 20);
  ctx.lineTo(larg * 0.36, horizonteBase + 16);
  ctx.lineTo(larg * 0.52, horizonteBase - 80);
  ctx.lineTo(larg * 0.7, horizonteBase + 28);
  ctx.lineTo(larg * 0.87, horizonteBase - 30);
  ctx.lineTo(larg, horizonteBase + 14);
  ctx.lineTo(larg, alt);
  ctx.closePath();
  ctx.fillStyle = montanha2;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, alt);
  ctx.lineTo(0, horizonteBase + 80);
  ctx.lineTo(larg * 0.14, horizonteBase + 50);
  ctx.lineTo(larg * 0.26, horizonteBase + 95);
  ctx.lineTo(larg * 0.45, horizonteBase + 40);
  ctx.lineTo(larg * 0.64, horizonteBase + 110);
  ctx.lineTo(larg * 0.82, horizonteBase + 46);
  ctx.lineTo(larg, horizonteBase + 75);
  ctx.lineTo(larg, alt);
  ctx.closePath();
  ctx.fillStyle = montanha3;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, alt);
  ctx.lineTo(0, alt * 0.9);
  ctx.lineTo(larg * 0.25, alt * 0.86);
  ctx.lineTo(larg * 0.5, alt * 0.9);
  ctx.lineTo(larg * 0.75, alt * 0.88);
  ctx.lineTo(larg, alt * 0.92);
  ctx.lineTo(larg, alt);
  ctx.closePath();
  ctx.fillStyle = horizonte;
  ctx.globalAlpha = 0.75;
  ctx.fill();
  ctx.globalAlpha = 1;

  const linhaFuga = ctx.createLinearGradient(pontoFugaX - 120, pontoFugaY, pontoFugaX + 120, pontoFugaY);
  linhaFuga.addColorStop(0, 'rgba(255,255,255,0)');
  linhaFuga.addColorStop(0.5, 'rgba(255,255,255,0.2)');
  linhaFuga.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = linhaFuga;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, pontoFugaY);
  ctx.lineTo(larg, pontoFugaY);
  ctx.stroke();

  const linhaHorizonte = ctx.createLinearGradient(0, horizonteBase, 0, alt);
  linhaHorizonte.addColorStop(0, 'rgba(255,255,255,0)');
  linhaHorizonte.addColorStop(1, 'rgba(12, 18, 30, 0.38)');
  ctx.fillStyle = linhaHorizonte;
  ctx.fillRect(0, horizonteBase, larg, alt - horizonteBase);

  requestAnimationFrame(animarFundo);
}
animarFundo();

// REGRAS DO SISTEMA DE ÁLBUNS E FIREBASE
const PESO_NOTAS = {
  "Foda": 10, "Otimaa": 9, "Otima": 8, "Boa": 7, "+-": 6, "Desgracera": 5, "Pessima": 2, "Funk": -1
};

const NASCIMENTO = new Date(2006, 10, 12);
function calcularIdade(dataBase = new Date()) {
  let idade = dataBase.getFullYear() - NASCIMENTO.getFullYear();
  const m = dataBase.getMonth() - NASCIMENTO.getMonth();
  if (m < 0 || (m === 0 && dataBase.getDate() < NASCIMENTO.getDate())) idade--;
  return idade;
}

let usuarioAtual = null;
let perfilUsuarioAtual = null;
let meuGrafico = null;
let graficoDecadasChart = null;
let adminChart = null;
let leituraStatusChart = null;
let leituraEditoraChart = null;
let leituraPersonagensChart = null;
let quadrinhosUnsubscribe = null;
let quadrinhosLista = [];
let quadrinhosPagina = 1;
const OBRAS_POR_PAGINA = 12;
let imagemBase64Temp = "";
let todosOsAlbuns = [];
let albunsFiltrados = [];
let paginaAtual = 1;
let top5ListaCompleta = [];
let top5Unsubscribe = null;
let viagensUnsubscribe = null;
let observacoesUnsubscribe = null;
let timerAudicaoSegundos = 0;
let timerAudicaoIntervalo = null;
const ITENS_POR_PAGINA = 12;
const ADMIN_EMAILS = ['matheusgustavodasilvapires@gmail.com'];
const PERFIL_USERS_COLLECTION = 'usuarios';

function ajustarAlturaCanvas(canvas, totalItens, minHeight = 300, alturaPorItem = 42, maxHeight = 620, minWidth = 720) {
  if (!canvas) return;

  const wrapper = canvas.closest('.canvas-wrapper');
  const alturaDinamica = Math.min(Math.max(minHeight, totalItens * alturaPorItem), maxHeight);
  const larguraDinamica = Math.max(minWidth, totalItens * 18);

  canvas.style.height = `${alturaDinamica}px`;
  canvas.style.minHeight = `${alturaDinamica}px`;
  canvas.style.width = `${larguraDinamica}px`;
  canvas.style.minWidth = `${larguraDinamica}px`;

  if (wrapper) {
    wrapper.style.height = `${alturaDinamica}px`;
    wrapper.style.maxHeight = `${maxHeight}px`;
    wrapper.style.minWidth = '100%';
    wrapper.scrollLeft = 0;
  }
}

function normalizarEmail(email = '') {
  return (email || '').trim().toLowerCase();
}

function usuarioEhAdmin(user = null, perfil = null) {
  const emailUsuario = normalizarEmail(user?.email || perfil?.email || '');
  const papel = (perfil?.role || '').toLowerCase();
  return papel === 'admin' || ADMIN_EMAILS.includes(emailUsuario);
}

async function garantirPerfilUsuario(user) {
  if (!user) {
    perfilUsuarioAtual = null;
    return null;
  }

  const perfilRef = doc(db, PERFIL_USERS_COLLECTION, user.uid);
  const perfilSnap = await getDoc(perfilRef);

  if (!perfilSnap.exists()) {
    const perfilBase = {
      uid: user.uid,
      email: user.email || '',
      role: ADMIN_EMAILS.includes(normalizarEmail(user.email)) ? 'admin' : 'user',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
      ultimoLogin: serverTimestamp()
    };
    await setDoc(perfilRef, perfilBase);
    perfilUsuarioAtual = { id: user.uid, ...perfilBase };
    return perfilUsuarioAtual;
  }

  const perfilExistente = { id: perfilSnap.id, ...perfilSnap.data() };
  const deveSerAdmin = usuarioEhAdmin(user, perfilExistente);

  if (deveSerAdmin && String(perfilExistente.role || '').toLowerCase() !== 'admin') {
    await updateDoc(perfilRef, {
      role: 'admin',
      email: user.email || perfilExistente.email || '',
      atualizadoEm: serverTimestamp()
    });
  }

  perfilUsuarioAtual = { ...perfilExistente, role: deveSerAdmin ? 'admin' : (perfilExistente.role || 'user') };
  if (normalizarEmail(perfilUsuarioAtual.email) !== normalizarEmail(user.email || '')) {
    await updateDoc(perfilRef, {
      email: user.email || perfilUsuarioAtual.email || '',
      atualizadoEm: serverTimestamp()
    });
    perfilUsuarioAtual.email = user.email || perfilUsuarioAtual.email || '';
  }

  return perfilUsuarioAtual;
}

async function carregarEstatisticasAdmin() {
  try {
    const [usuariosSnap, albunsSnap, top5Snap, viagensSnap] = await Promise.all([
      getDocs(collection(db, PERFIL_USERS_COLLECTION)),
      getDocs(collection(db, 'albuns')),
      getDocs(query(collection(db, 'viagens'), where('categoria', '==', 'top5'))),
      getDocs(collection(db, 'viagens'))
    ]);

    const totalUsuarios = usuariosSnap.size;
    const totalAlbuns = albunsSnap.size;
    const totalTop5 = top5Snap.size;
    const totalViagens = viagensSnap.size;
    const totalDocumentos = totalUsuarios + totalAlbuns + totalTop5 + totalViagens;
    const usoPercentual = Math.min(100, ((totalDocumentos / 25000) * 100).toFixed(1));

    const totalUsuariosEl = document.getElementById('admin-total-usuarios');
    const totalAlbunsEl = document.getElementById('admin-total-albuns');
    const totalTop5El = document.getElementById('admin-total-top5');
    const usoBancoEl = document.getElementById('admin-uso-banco');

    if (totalUsuariosEl) totalUsuariosEl.textContent = totalUsuarios;
    if (totalAlbunsEl) totalAlbunsEl.textContent = totalAlbuns;
    if (totalTop5El) totalTop5El.textContent = totalTop5;
    if (usoBancoEl) usoBancoEl.textContent = `${usoPercentual}%`;

    const ctx = document.getElementById('graficoAdminUsoBanco')?.getContext('2d');
    if (ctx) {
      const labels = ['Usuários', 'Álbuns', 'Top 5', 'Viagens'];
      const data = [totalUsuarios, totalAlbuns, totalTop5, totalViagens];

      if (adminChart) adminChart.destroy();

      adminChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e5e7eb' } }
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas do admin:', error);
    mostrarToast('Não foi possível carregar as estatísticas de admin.', 'erro');
  }
}

async function carregarUsuariosAdmin() {
  try {
    const usuariosSnap = await getDocs(query(collection(db, PERFIL_USERS_COLLECTION)));
    const usuarios = usuariosSnap.docs
      .map((docUsuario) => ({ id: docUsuario.id, ...docUsuario.data() }))
      .sort((a, b) => (a.email || '').localeCompare(b.email || ''));

    const tbody = document.getElementById('admin-usuarios-body');
    if (!tbody) return;

    if (!usuarios.length) {
      tbody.innerHTML = '<tr><td colspan="4">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = usuarios.map((usuario) => {
      const papel = String(usuario.role || 'user').toLowerCase();
      const tipoLabel = papel === 'admin' ? 'Administrador' : 'Usuário';
      const ultimaAtualizacao = formatarDataHora(usuario.atualizadoEm || usuario.criadoEm);
      const ehMesmoUsuario = usuarioAtual && usuario.uid === usuarioAtual.uid;

      return `
        <tr>
          <td>${usuario.email || 'Sem e-mail'}</td>
          <td><span class="admin-role-tag ${papel === 'admin' ? 'admin' : ''}">${tipoLabel}</span></td>
          <td>${ultimaAtualizacao}</td>
          <td>
            <button type="button" class="btn-alerta admin-acao" data-admin-editar="${usuario.id}">Editar</button>
            <button type="button" class="btn-perigo admin-acao" data-admin-excluir="${usuario.id}" ${ehMesmoUsuario ? 'disabled' : ''}>Excluir</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Erro ao carregar usuários do admin:', error);
    mostrarToast('Não foi possível carregar a lista de usuários.', 'erro');
  }
}

async function renderAdminDashboard() {
  if (!usuarioEhAdmin(usuarioAtual, perfilUsuarioAtual)) {
    mostrarToast('Acesso de administrador negado.', 'erro');
    navegarPara('sec-dashboard');
    return;
  }

  await carregarEstatisticasAdmin();
  await carregarUsuariosAdmin();
}

function aplicarAcessoAdmin() {
  const adminButtons = document.querySelectorAll('.admin-only');
  const permitido = usuarioEhAdmin(usuarioAtual, perfilUsuarioAtual);

  adminButtons.forEach((botao) => {
    botao.classList.toggle('escondido', !permitido);
  });
}

async function editarUsuarioAdmin(idUsuario) {
  try {
    const perfilDoc = await getDoc(doc(db, PERFIL_USERS_COLLECTION, idUsuario));
    if (!perfilDoc.exists()) {
      mostrarToast('Usuário não encontrado.', 'erro');
      return;
    }

    const usuario = { id: perfilDoc.id, ...perfilDoc.data() };
    const inputId = document.getElementById('admin-user-id');
    const inputEmail = document.getElementById('admin-user-email');
    const inputSenha = document.getElementById('admin-user-senha');
    const inputRole = document.getElementById('admin-user-role');

    if (inputId) inputId.value = usuario.id;
    if (inputEmail) inputEmail.value = usuario.email || '';
    if (inputSenha) inputSenha.value = '';
    if (inputRole) inputRole.value = String(usuario.role || 'user');

    window.navegarPara('sec-admin');
  } catch (error) {
    console.error('Erro ao editar usuário admin:', error);
    mostrarToast('Não foi possível carregar este usuário para edição.', 'erro');
  }
}

async function excluirUsuarioAdmin(idUsuario) {
  if (!idUsuario) return;

  if (usuarioAtual && idUsuario === usuarioAtual.uid) {
    mostrarToast('Você não pode excluir sua própria conta no painel admin.', 'erro');
    return;
  }

  const confirmar = window.confirm('Tem certeza que deseja remover este usuário do painel?');
  if (!confirmar) return;

  try {
    await deleteDoc(doc(db, PERFIL_USERS_COLLECTION, idUsuario));
    mostrarToast('Usuário removido do painel de administração.');
    await carregarUsuariosAdmin();
    await carregarEstatisticasAdmin();
  } catch (error) {
    console.error('Erro ao excluir usuário admin:', error);
    mostrarToast('Não foi possível excluir este usuário.', 'erro');
  }
}

async function salvarUsuarioAdmin(event) {
  event.preventDefault();

  if (!usuarioEhAdmin(usuarioAtual, perfilUsuarioAtual)) {
    mostrarToast('Acesso de administrador obrigatório.', 'erro');
    return;
  }

  const inputId = document.getElementById('admin-user-id');
  const inputEmail = document.getElementById('admin-user-email');
  const inputSenha = document.getElementById('admin-user-senha');
  const inputRole = document.getElementById('admin-user-role');

  if (!inputEmail || !inputSenha || !inputRole) return;

  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();
  const role = inputRole.value;

  if (!email || !senha) {
    mostrarToast('Preencha e-mail e senha antes de salvar.', 'erro');
    return;
  }

  const idUsuario = inputId ? inputId.value : '';

  if (idUsuario) {
    try {
      const perfilRef = doc(db, PERFIL_USERS_COLLECTION, idUsuario);
      await updateDoc(perfilRef, {
        email,
        role,
        atualizadoEm: serverTimestamp()
      });

      if (usuarioAtual && idUsuario === usuarioAtual.uid) {
        const userAtual = auth.currentUser;
        if (userAtual && userAtual.email !== email) {
          await updateEmail(userAtual, email);
        }
        if (userAtual && senha) {
          await updatePassword(userAtual, senha);
        }
      } else {
        mostrarToast('Perfil atualizado. Para trocar senha/e-mail de outra conta, use um backend admin.', 'erro');
      }

      mostrarToast('Usuário atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      mostrarToast('Não foi possível atualizar este usuário.', 'erro');
    }
  } else {
    try {
      const novoUsuario = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, PERFIL_USERS_COLLECTION, novoUsuario.user.uid), {
        uid: novoUsuario.user.uid,
        email: novoUsuario.user.email || email,
        role,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        ultimoLogin: serverTimestamp()
      });
      mostrarToast('Usuário criado com sucesso.');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      mostrarToast('Não foi possível criar este usuário.', 'erro');
    }
  }

  document.getElementById('form-admin-usuario')?.reset();
  document.getElementById('admin-user-id').value = '';
  await carregarUsuariosAdmin();
  await carregarEstatisticasAdmin();
}

function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = mensagem;
  toast.className = `toast ${tipo}`;
  toast.classList.remove('escondido');

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.add('escondido'), 3000);
}

function controlarFormularioRecolhivel(formId, abrir) {
  const form = document.getElementById(formId);
  if (form) form.classList.toggle('escondido', !abrir);
}

function fecharFormulariosSecundarios() {
  ['form-top5', 'form-viagem', 'form-observacao'].forEach((id) => controlarFormularioRecolhivel(id, false));
}

function obterUsuarioAtivo() {
  return auth.currentUser || usuarioAtual;
}

function validarUsuarioParaSalvar() {
  const usuarioAtivo = obterUsuarioAtivo();
  if (!usuarioAtivo) {
    mostrarToast('Faça login antes de salvar.', 'erro');
    return false;
  }
  return true;
}

function fecharMenuMobile() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navMenu) navMenu.classList.remove('active');
  if (menuToggle) {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isActive);
      menuToggle.setAttribute('aria-expanded', String(isActive));
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('active')) return;
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        fecharMenuMobile();
      }
    });

    document.querySelectorAll('.nav-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        if (target) {
          fecharMenuMobile();
          window.navegarPara(target);
        }
      });
    });
  }
});

document.getElementById('btn-toggle-pass').addEventListener('click', () => {
  const inputPass = document.getElementById('auth-pass');
  const btn = document.getElementById('btn-toggle-pass');
  const mostrando = inputPass.type === 'text';
  inputPass.type = mostrando ? 'password' : 'text';
  btn.textContent = mostrando ? 'Mostrar' : 'Ocultar';
});

window.navegarPara = function(idTela) {
  fecharFormulariosSecundarios();
  document.querySelectorAll('.tela').forEach(t => t.classList.add('escondido'));
  const telaDestino = document.getElementById(idTela);
  if (telaDestino) telaDestino.classList.remove('escondido');

  const mapeamento = {
    'sec-dashboard': 'sec-dashboard',
    'sec-novo-album': 'sec-novo-album',
    'sec-top5': 'sec-top5',
    'sec-viagens': 'sec-viagens',
    'sec-observacoes': 'sec-observacoes',
    'sec-bandas': 'sec-bandas',
    'sec-quadrinhos': 'sec-quadrinhos',
    'sec-estatisticas': 'sec-estatisticas',
    'sec-admin': 'sec-admin'
  };

  document.querySelectorAll('.nav-btn').forEach((button) => {
    const alvo = button.getAttribute('data-target');
    const ativo = alvo === mapeamento[idTela];
    button.classList.toggle('active', ativo);
    button.setAttribute('aria-current', ativo ? 'page' : 'false');
  });

  fecharMenuMobile();

  if (idTela === 'sec-dashboard') carregarAlbuns();
  if (idTela === 'sec-bandas') carregarBandas();
  if (idTela === 'sec-quadrinhos') carregarQuadrinhosLivros();
  if (idTela === 'sec-estatisticas') carregarEstatisticas();
  if (idTela === 'sec-admin') renderAdminDashboard();
};

window.prepararNovoAlbum = function() {
  document.getElementById('form-album').reset();
  document.getElementById('album-id').value = '';
  document.getElementById('container-faixas').innerHTML = '';
  document.getElementById('preview-container').classList.add('escondido');
  document.getElementById('form-titulo').innerText = 'Novo Álbum';
  imagemBase64Temp = "";
  resetarTimerAudicao();
  addLinhaFaixa();
  navegarPara('sec-novo-album');
};

// AUTENTICAÇÃO
document.getElementById('btn-register').addEventListener('click', () => {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) return mostrarToast("Preencha e-mail e senha!", "erro");

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => mostrarToast("Conta criada com sucesso!"))
    .catch(err => mostrarToast("Erro no cadastro: " + err.message, "erro"));
});

document.getElementById('btn-login').addEventListener('click', () => {
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) return mostrarToast("Preencha e-mail e senha!", "erro");

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => mostrarToast("Login efetuado!"))
    .catch(err => mostrarToast("E-mail ou senha incorretos", "erro"));
});

const formAdminUsuario = document.getElementById('form-admin-usuario');
if (formAdminUsuario) {
  formAdminUsuario.addEventListener('submit', salvarUsuarioAdmin);
}

const btnLimparAdminUsuario = document.getElementById('admin-btn-limpar-usuario');
if (btnLimparAdminUsuario) {
  btnLimparAdminUsuario.addEventListener('click', () => {
    const formAdmin = document.getElementById('form-admin-usuario');
    if (formAdmin) formAdmin.reset();
    const inputId = document.getElementById('admin-user-id');
    if (inputId) inputId.value = '';
  });
}

const tbodyAdminUsuarios = document.getElementById('admin-usuarios-body');
if (tbodyAdminUsuarios) {
  tbodyAdminUsuarios.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-admin-editar]');
    const targetExcluir = event.target.closest('[data-admin-excluir]');

    if (target) {
      await editarUsuarioAdmin(target.dataset.adminEditar);
    }

    if (targetExcluir) {
      await excluirUsuarioAdmin(targetExcluir.dataset.adminExcluir);
    }
  });
}

document.getElementById('btn-logout').addEventListener('click', () => {
  signOut(auth).then(() => bloquearTela());
});

onAuthStateChanged(auth, async (user) => {
  const lockscreen = document.getElementById('lockscreen');

  if (top5Unsubscribe) top5Unsubscribe();
  if (viagensUnsubscribe) viagensUnsubscribe();
  if (observacoesUnsubscribe) observacoesUnsubscribe();
  if (quadrinhosUnsubscribe) quadrinhosUnsubscribe();
  quadrinhosUnsubscribe = null;

  if (user) {
    usuarioAtual = user;
    perfilUsuarioAtual = await garantirPerfilUsuario(user);
    aplicarAcessoAdmin();
    document.getElementById('main-header').classList.remove('escondido');
    if (lockscreen) {
      lockscreen.style.zIndex = '0';
      lockscreen.style.pointerEvents = 'none';
      lockscreen.classList.add('escondido');
    }
    mostrarWallpaperPrincipal();
    subscribeTop5();
    subscribeViagens();
    subscribeObservacoes();
    navegarPara('sec-dashboard');
  } else {
    usuarioAtual = null;
    perfilUsuarioAtual = null;
    aplicarAcessoAdmin();
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) mainHeader.classList.add('escondido');

    if (lockscreen) {
      lockscreen.style.zIndex = '2000';
      lockscreen.style.pointerEvents = 'auto';
      lockscreen.classList.remove('escondido');
    }

    bloquearTela();
  }
});

function formatarDataHora(valor) {
  if (!valor) return 'Sem data';
  const data = valor.toDate ? valor.toDate() : new Date(valor);
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
}

function criarHistorico(alteracao) {
  return {
    data: new Date(),
    alteracao
  };
}

function calcularTempoConclusao(criadoEm, concluidoEm) {
  if (!criadoEm || !concluidoEm) return 'Pendente';

  const inicio = criadoEm.toDate ? criadoEm.toDate() : new Date(criadoEm);
  const fim = concluidoEm.toDate ? concluidoEm.toDate() : new Date(concluidoEm);
  const diffMs = Math.max(0, fim.getTime() - inicio.getTime());

  const segundos = Math.floor(diffMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  const restanteHoras = horas % 24;
  const restanteMinutos = minutos % 60;

  const partes = [];
  if (dias > 0) partes.push(`${dias} dia${dias > 1 ? 's' : ''}`);
  if (restanteHoras > 0) partes.push(`${restanteHoras} hora${restanteHoras > 1 ? 's' : ''}`);
  if (restanteMinutos > 0 && dias === 0) partes.push(`${restanteMinutos} min`);

  if (partes.length === 0) return 'Concluído em menos de 1 minuto';
  return `Concluído em ${partes.join(' e ')}`;
}

// TOP 5
function subscribeTop5() {
  if (!usuarioAtual) return;

  const q = query(
    collection(db, 'viagens'),
    where('categoria', '==', 'top5'),
    where('userId', '==', usuarioAtual.uid)
  );

  if (top5Unsubscribe) top5Unsubscribe();

  top5Unsubscribe = onSnapshot(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((item) => lista.push({ id: item.id, ...item.data() }));
    top5ListaCompleta = lista;
    aplicarFiltrosTop5();
  });
}

window.aplicarFiltrosTop5 = function() {
  const termo = document.getElementById('filtro-top5-busca')?.value.toLowerCase().trim() || '';
  const ordem = document.getElementById('filtro-top5-ordem')?.value || 'novo';
  let lista = [...top5ListaCompleta];

  if (termo) {
    lista = lista.filter((top) => {
      const titulo = (top.titulo || '').toLowerCase();
      const itens = Array.isArray(top.itens) ? top.itens.join(' ').toLowerCase() : '';
      return titulo.includes(termo) || itens.includes(termo);
    });
  }

  lista.sort((a, b) => {
    const aa = a.atualizadoEm && a.atualizadoEm.toDate ? a.atualizadoEm.toDate() : new Date(a.atualizadoEm || 0);
    const bb = b.atualizadoEm && b.atualizadoEm.toDate ? b.atualizadoEm.toDate() : new Date(b.atualizadoEm || 0);

    if (ordem === 'antigo') return aa - bb;
    if (ordem === 'titulo') return (a.titulo || '').localeCompare(b.titulo || '');
    return bb - aa;
  });

  const container = document.getElementById('lista-top5');
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="empty-state">Nenhum Top 5 cadastrado.</p>';
    return;
  }

  container.innerHTML = lista.map((top) => {
    const itens = Array.isArray(top.itens) ? top.itens : [];
    return `
      <div class="top5-card">
        <div class="card-cabecalho">
          <h3>${top.titulo || 'Top 5'}</h3>
        </div>
        <div class="top5-lista">
          ${itens.map((item, index) => `
            <div class="top5-rank">
              <span>${index + 1}º</span>
              <span>${item}</span>
            </div>
          `).join('')}
        </div>
        <div class="card-datas">
          Criado: ${formatarDataHora(top.criadoEm)}<br>
          Atualizado: ${formatarDataHora(top.atualizadoEm)}
        </div>
        <div class="card-acoes">
          <button type="button" class="btn-alerta" data-top5-editar="${top.id}">Editar</button>
          <button type="button" class="btn-perigo" data-top5-excluir="${top.id}">Excluir</button>
        </div>
      </div>
    `;
  }).join('');
};

document.getElementById('btn-novo-top5').addEventListener('click', () => {
  document.getElementById('form-top5').reset();
  document.getElementById('top5-id').value = '';
  controlarFormularioRecolhivel('form-top5', true);
  document.getElementById('top5-titulo').focus();
});

document.getElementById('btn-cancelar-top5').addEventListener('click', () => {
  document.getElementById('form-top5').reset();
  document.getElementById('top5-id').value = '';
  controlarFormularioRecolhivel('form-top5', false);
});

document.getElementById('form-top5').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('top5-id').value;
  const titulo = document.getElementById('top5-titulo').value.trim();
  const itens = Array.from({ length: 5 }, (_, index) => document.getElementById(`top5-item-${index + 1}`).value.trim());

  if (!titulo || itens.some(item => !item)) {
    return mostrarToast('Preencha todos os campos do Top 5!', 'erro');
  }

  try {
    if (id) {
      const docSnap = await getDoc(doc(db, 'viagens', id));
      const antigo = docSnap.data() || {};
      await updateDoc(doc(db, 'viagens', id), {
        titulo,
        itens,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Top 5 atualizado!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        categoria: 'top5',
        titulo,
        itens,
        userId: usuarioAtivo.uid,
        realizado: false,
        realizadaEm: null,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Top 5 salvo com sucesso!');
    }

    document.getElementById('form-top5').reset();
    document.getElementById('top5-id').value = '';
    controlarFormularioRecolhivel('form-top5', false);
  } catch (erro) {
    console.error('Erro ao salvar Top 5:', erro);
    mostrarToast('Erro ao salvar o Top 5', 'erro');
  }
});

document.getElementById('lista-top5').addEventListener('click', async (event) => {
  const editarId = event.target.dataset.top5Editar;
  const excluirId = event.target.dataset.top5Excluir;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;

    document.getElementById('top5-id').value = editarId;
    document.getElementById('top5-titulo').value = dados.titulo || '';
    Array.from({ length: 5 }, (_, index) => index + 1).forEach((numero) => {
      document.getElementById(`top5-item-${numero}`).value = (dados.itens && dados.itens[numero - 1]) || '';
    });

    controlarFormularioRecolhivel('form-top5', true);
    document.getElementById('top5-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Deseja excluir este Top 5?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Top 5 removido!');
    }
  }

});

// VIAGENS
function subscribeViagens() {
  if (!usuarioAtual) return;

  const q = query(
    collection(db, 'viagens'),
    where('categoria', '==', 'viagem'),
    where('userId', '==', usuarioAtual.uid)
  );
  if (viagensUnsubscribe) viagensUnsubscribe();

  viagensUnsubscribe = onSnapshot(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((item) => {
      const dados = item.data();
      if (dados.categoria === 'viagem') lista.push({ id: item.id, ...dados });
    });
    lista.sort((a, b) => {
      const aa = a.atualizadoEm && a.atualizadoEm.toDate ? a.atualizadoEm.toDate() : new Date(a.atualizadoEm || 0);
      const bb = b.atualizadoEm && b.atualizadoEm.toDate ? b.atualizadoEm.toDate() : new Date(b.atualizadoEm || 0);
      return bb - aa;
    });

    const container = document.getElementById('lista-viagens');
    if (!container) return;
    if (!lista.length) {
      container.innerHTML = '<p class="empty-state">Nenhuma viagem cadastrada.</p>';
      return;
    }

    container.innerHTML = lista.map((viagem) => {
      const realizada = Boolean(viagem.realizada);
      const marcadaEm = viagem.realizadaEm ? formatarDataHora(viagem.realizadaEm) : 'Ainda não marcada';
      const tarefas = Array.isArray(viagem.tarefas) && viagem.tarefas.length
        ? viagem.tarefas
        : [{ texto: viagem.titulo || 'Ação', concluida: realizada }];

      return `
        <div class="viagem-card ${realizada ? 'viagem-feita' : ''}">
          <div class="card-cabecalho">
            <h3>${viagem.titulo || 'Viagem'}</h3>
            <span class="badge-duracao ${realizada ? 'feito' : ''}">${realizada ? 'Concluída' : 'Pendente'}</span>
          </div>

          <div class="lista-tarefas-card">
            ${tarefas.map((tarefa, index) => `
              <label class="viagem-status-row">
                <input type="checkbox" data-tarefa-toggle="${viagem.id}" data-tarefa-index="${index}" ${tarefa.concluida ? 'checked' : ''}>
                <span>${escaparHtml(tarefa.texto || `Tarefa ${index + 1}`)}</span>
              </label>
            `).join('')}
          </div>

          <div class="viagem-status-data">
            ${realizada ? `Realizada em: ${marcadaEm}` : `Data da realização: ${marcadaEm}`}
          </div>

          <div class="card-datas">
            Criado: ${formatarDataHora(viagem.criadoEm)}<br>
            Atualizado: ${formatarDataHora(viagem.atualizadoEm)}
          </div>
          <div class="card-acoes">
            <button type="button" class="btn-alerta" data-viagem-editar="${viagem.id}">Editar</button>
            <button type="button" class="btn-perigo" data-viagem-excluir="${viagem.id}">Excluir</button>
          </div>
        </div>
      `;
    }).join('');
  }, (erro) => {
    console.error('Erro ao carregar To Do Lists:', erro);
    const container = document.getElementById('lista-viagens');
    if (container) {
      container.innerHTML = '<p class="empty-state">Não foi possível carregar as tarefas. Tente atualizar a página.</p>';
    }
  });
}

document.getElementById('btn-nova-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
  controlarFormularioRecolhivel('form-viagem', true);
  document.getElementById('viagem-titulo').focus();
});

document.getElementById('btn-cancelar-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
  controlarFormularioRecolhivel('form-viagem', false);
});

document.getElementById('form-viagem').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('viagem-id').value;
  const titulo = document.getElementById('viagem-titulo').value.trim();
  const tarefas = document.getElementById('viagem-tarefas').value
    .split(';')
    .map((texto) => texto.trim())
    .filter(Boolean)
    .map((texto) => ({ texto, concluida: false }));

  if (!titulo) {
    return mostrarToast('Informe o nome da viagem.', 'erro');
  }

  try {
    if (id) {
      const viagemAnterior = (await getDoc(doc(db, 'viagens', id))).data() || {};
      const tarefasAtualizadas = tarefas.length ? tarefas : [{ texto: titulo, concluida: false }];
      await updateDoc(doc(db, 'viagens', id), {
        categoria: 'viagem',
        titulo,
        tarefas: tarefasAtualizadas,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Viagem atualizada!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        categoria: 'viagem',
        titulo,
        tarefas: tarefas.length ? tarefas : [{ texto: titulo, concluida: false }],
        userId: usuarioAtivo.uid,
        realizada: false,
        realizadaEm: null,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Viagem salva com sucesso!');
    }

    document.getElementById('form-viagem').reset();
    document.getElementById('viagem-id').value = '';
    controlarFormularioRecolhivel('form-viagem', false);
  } catch (erro) {
    console.error('Erro ao salvar viagem:', erro);
    mostrarToast('Erro ao salvar viagem.', 'erro');
  }
});

document.getElementById('lista-viagens').addEventListener('click', async (event) => {
  const editarId = event.target.dataset.viagemEditar;
  const excluirId = event.target.dataset.viagemExcluir;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;

    document.getElementById('viagem-id').value = editarId;
    document.getElementById('viagem-titulo').value = dados.titulo || '';
    document.getElementById('viagem-tarefas').value = (dados.tarefas || []).map((tarefa) => tarefa.texto).join('; ');
    controlarFormularioRecolhivel('form-viagem', true);
    document.getElementById('viagem-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Deseja excluir esta viagem?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Viagem removida!');
    }
  }
});

document.getElementById('lista-viagens').addEventListener('change', async (event) => {
  const checkbox = event.target.closest('[data-tarefa-toggle]');
  if (!checkbox) return;

  const viagemId = checkbox.dataset.tarefaToggle;
  const tarefaIndex = Number(checkbox.dataset.tarefaIndex);
  const viagemDoc = await getDoc(doc(db, 'viagens', viagemId));
  if (!viagemDoc.exists()) return;
  const viagem = viagemDoc.data();
  const tarefas = Array.isArray(viagem.tarefas) && viagem.tarefas.length
    ? viagem.tarefas
    : [{ texto: viagem.titulo || 'Ação', concluida: false }];
  if (!tarefas[tarefaIndex]) return;
  tarefas[tarefaIndex].concluida = checkbox.checked;
  const todasConcluidas = tarefas.every((tarefa) => tarefa.concluida);

  await updateDoc(doc(db, 'viagens', viagemId), {
    categoria: 'viagem',
    tarefas,
    realizada: todasConcluidas,
    realizadaEm: todasConcluidas ? serverTimestamp() : null,
    atualizadoEm: serverTimestamp()
  });

  mostrarToast(checkbox.checked ? 'Tarefa concluída!' : 'Tarefa reaberta.');
});

// OBSERVAÇÕES
function subscribeObservacoes() {
  if (!usuarioAtual) return;

  const q = query(
    collection(db, 'viagens'),
    where('categoria', '==', 'observacao'),
    where('userId', '==', usuarioAtual.uid)
  );

  if (observacoesUnsubscribe) observacoesUnsubscribe();

  observacoesUnsubscribe = onSnapshot(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((item) => lista.push({ id: item.id, ...item.data() }));
    lista.sort((a, b) => {
      const aa = a.atualizadoEm && a.atualizadoEm.toDate ? a.atualizadoEm.toDate() : new Date(a.atualizadoEm || 0);
      const bb = b.atualizadoEm && b.atualizadoEm.toDate ? b.atualizadoEm.toDate() : new Date(b.atualizadoEm || 0);
      return bb - aa;
    });

    const container = document.getElementById('lista-observacoes');
    if (!container) return;
    if (!lista.length) {
      container.innerHTML = '<p class="empty-state">Nenhuma anotação cadastrada.</p>';
      return;
    }

    container.innerHTML = lista.map((nota) => `
      <div class="nota-card">
        <h3>${nota.titulo || 'Sem título'}</h3>
        <p class="nota-meta">Atualizado em ${formatarDataHora(nota.atualizadoEm)}</p>
        <div class="nota-conteudo">
          <p>${(nota.conteudo || '').replace(/\n/g, '<br>')}</p>
        </div>
        <div class="card-acoes">
          <button type="button" class="btn-alerta" data-obs-editar="${nota.id}">Editar</button>
          <button type="button" class="btn-perigo" data-obs-excluir="${nota.id}">Excluir</button>
        </div>
      </div>
    `).join('');
  });
}

document.getElementById('btn-nova-observacao').addEventListener('click', () => {
  document.getElementById('form-observacao').reset();
  document.getElementById('obs-id').value = '';
  controlarFormularioRecolhivel('form-observacao', true);
  document.getElementById('obs-titulo').focus();
});

document.getElementById('btn-cancelar-observacao').addEventListener('click', () => {
  document.getElementById('form-observacao').reset();
  document.getElementById('obs-id').value = '';
  controlarFormularioRecolhivel('form-observacao', false);
});

document.getElementById('form-observacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('obs-id').value;
  const tituloInformado = document.getElementById('obs-titulo').value;
  const titulo = tituloInformado.trim() || 'Sem título';
  const conteudo = document.getElementById('obs-conteudo').value;

  if (!conteudo.trim()) {
    return mostrarToast('Preencha título e conteúdo da anotação.', 'erro');
  }

  try {
    if (id) {
      const docSnap = await getDoc(doc(db, 'viagens', id));
      await updateDoc(doc(db, 'viagens', id), {
        titulo,
        conteudo,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Anotação atualizada!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        categoria: 'observacao',
        titulo,
        conteudo,
        userId: usuarioAtivo.uid,
        realizado: false,
        realizadaEm: null,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Anotação salva!');
    }

    document.getElementById('form-observacao').reset();
    document.getElementById('obs-id').value = '';
    controlarFormularioRecolhivel('form-observacao', false);
  } catch (erro) {
    console.error('Erro ao salvar observação:', erro);
    mostrarToast('Erro ao salvar observação.', 'erro');
  }
});

document.getElementById('lista-observacoes').addEventListener('click', async (event) => {
  const editarId = event.target.dataset.obsEditar;
  const excluirId = event.target.dataset.obsExcluir;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;
    document.getElementById('obs-id').value = editarId;
    document.getElementById('obs-titulo').value = dados.titulo || '';
    document.getElementById('obs-conteudo').value = dados.conteudo || '';
    controlarFormularioRecolhivel('form-observacao', true);
    document.getElementById('obs-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Excluir esta anotação?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Anotação excluída!');
    }
  }

});

// UPLOAD DE IMAGEM
document.getElementById('album-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = new Image();
      img.onload = function() {
        const canvasImg = document.createElement('canvas');
        const MAX_WIDTH = 600;
        let scale = MAX_WIDTH / img.width;
        if (scale > 1) scale = 1;

        canvasImg.width = img.width * scale;
        canvasImg.height = img.height * scale;

        const ctxImg = canvasImg.getContext('2d');
        ctxImg.drawImage(img, 0, 0, canvasImg.width, canvasImg.height);

        imagemBase64Temp = canvasImg.toDataURL('image/jpeg', 0.8);
        document.getElementById('img-preview').src = imagemBase64Temp;
        document.getElementById('preview-container').classList.remove('escondido');
        document.getElementById('album-imagem').value = ''; 
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// FAIXAS DINÂMICAS
const containerFaixas = document.getElementById('container-faixas');
document.getElementById('btn-add-faixa').addEventListener('click', () => addLinhaFaixa());

function formatarDuracao(segundos) {
  const horas = Math.floor(segundos / 3600).toString().padStart(2, '0');
  const minutos = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
  const segundosRestantes = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${horas}:${minutos}:${segundosRestantes}`;
}

function converterDuracaoParaSegundos(valor, fallback = 0) {
  const texto = String(valor ?? '').trim().toLowerCase();
  if (!texto) return Number(fallback) || 0;

  if (texto.includes(':')) {
    const partes = texto.split(':').map((parte) => Number(parte.replace(',', '.')) || 0);
    if (partes.length === 3) return Math.max(0, Math.round(partes[0] * 3600 + partes[1] * 60 + partes[2]));
    if (partes.length === 2) return Math.max(0, Math.round(partes[0] * 60 + partes[1]));
  }

  const unidades = [...texto.matchAll(/(\d+(?:[.,]\d+)?)\s*(h|hora?s?|m|minuto?s?|s|segundo?s?)/gi)];
  if (unidades.length) {
    return Math.max(0, Math.round(unidades.reduce((total, [, numero, unidade]) => {
      const valorNumerico = Number(numero.replace(',', '.')) || 0;
      if (unidade.startsWith('h')) return total + valorNumerico * 3600;
      if (unidade.startsWith('m')) return total + valorNumerico * 60;
      return total + valorNumerico;
    }, 0)));
  }

  const numero = Number(texto.replace(',', '.'));
  return Number.isFinite(numero) && numero > 0 ? Math.round(numero * 60) : 0;
}

function atualizarDisplayTimer() {
  const display = document.getElementById('audicao-tempo');
  const duracaoFormatada = formatarDuracao(timerAudicaoSegundos);
  if (display) display.textContent = duracaoFormatada;
  const campoDuracao = document.getElementById('album-duracao');
  if (campoDuracao && timerAudicaoSegundos > 0) campoDuracao.value = duracaoFormatada;
}

function iniciarTimerAudicao() {
  if (timerAudicaoIntervalo) return;
  timerAudicaoIntervalo = window.setInterval(() => {
    timerAudicaoSegundos += 1;
    atualizarDisplayTimer();
  }, 1000);
}

function pausarTimerAudicao() {
  if (!timerAudicaoIntervalo) return;
  window.clearInterval(timerAudicaoIntervalo);
  timerAudicaoIntervalo = null;
}

function resetarTimerAudicao() {
  pausarTimerAudicao();
  timerAudicaoSegundos = 0;
  atualizarDisplayTimer();
  const campoDuracao = document.getElementById('album-duracao');
  if (campoDuracao) campoDuracao.value = '';
}

function definirTimerAudicao(segundos = 0) {
  pausarTimerAudicao();
  timerAudicaoSegundos = Math.max(0, Number(segundos) || 0);
  atualizarDisplayTimer();
}

document.getElementById('btn-timer-iniciar').addEventListener('click', iniciarTimerAudicao);
document.getElementById('btn-timer-pausar').addEventListener('click', pausarTimerAudicao);
document.getElementById('btn-timer-resetar').addEventListener('click', resetarTimerAudicao);

function addLinhaFaixa(nome = '', nota = 'Boa') {
  const div = document.createElement('div');
  div.className = 'linha-faixa';
  const nomeInicial = nome || `Faixa ${containerFaixas.children.length + 1}`;
  const ehNomePadrao = !nome || /^Faixa \d+$/.test(nomeInicial);
  div.dataset.nomePadrao = ehNomePadrao ? 'true' : 'false';
  div.innerHTML = `
    <input type="text" placeholder="Faixa ${containerFaixas.children.length + 1}" value="${nomeInicial}" class="faixa-nome">
    <select class="faixa-nota">
      ${Object.keys(PESO_NOTAS).map(k => `<option value="${k}" ${k === nota ? 'selected' : ''}>${k} (${PESO_NOTAS[k]})</option>`).join('')}
    </select>
    <button type="button" onclick="removerLinhaFaixa(this)" class="btn-perigo">X</button>
  `;
  div.querySelector('.faixa-nome').addEventListener('input', (event) => {
    div.dataset.nomePadrao = event.target.value.trim() === '' || /^Faixa \d+$/.test(event.target.value.trim()) ? 'true' : 'false';
  });
  containerFaixas.appendChild(div);
}

function renumerarFaixasPadrao() {
  Array.from(containerFaixas.children).forEach((linha, index) => {
    const input = linha.querySelector('.faixa-nome');
    if (linha.dataset.nomePadrao === 'true' && input) {
      input.value = `Faixa ${index + 1}`;
      input.placeholder = `Faixa ${index + 1}`;
    }
  });
}

window.removerLinhaFaixa = function(botao) {
  botao.closest('.linha-faixa')?.remove();
  renumerarFaixasPadrao();
};

// SALVAR ÁLBUM
document.getElementById('form-album').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btnSalvar = document.getElementById('btn-salvar');
  btnSalvar.disabled = true;
  btnSalvar.innerText = "Salvando...";

  try {
    const id = document.getElementById('album-id').value;
    const nome = document.getElementById('album-nome').value;
    const banda = document.getElementById('album-banda').value;
    const ano = Number(document.getElementById('album-ano').value);
    const urlImagemInput = document.getElementById('album-imagem').value;
    const favorita = document.getElementById('album-favorita').value;
    const obs = document.getElementById('album-obs').value;
    const duracao = document.getElementById('album-duracao').value.trim();
    const duracaoSegundos = converterDuracaoParaSegundos(duracao, timerAudicaoSegundos);

    const imagemFinal = imagemBase64Temp || urlImagemInput || '';
    const faixasInputs = document.querySelectorAll('.linha-faixa');
    let somaNotas = 0;
    const faixas = [];

    faixasInputs.forEach((el, index) => {
      let fNome = el.querySelector('.faixa-nome').value.trim();
      const fNota = el.querySelector('.faixa-nota').value;
      if (!fNome) fNome = `Faixa ${index + 1}`;
      somaNotas += PESO_NOTAS[fNota];
      faixas.push({ nome: fNome, classificacao: fNota });
    });

    if (faixas.length === 0) {
      btnSalvar.disabled = false;
      btnSalvar.innerText = "Salvar Álbum";
      return mostrarToast("Adicione pelo menos uma faixa!", "erro");
    }

    const media = parseFloat((somaNotas / faixas.length).toFixed(2));
    const nmp = parseFloat(((media / 10) * 100).toFixed(1));
    const agoraISO = new Date().toISOString();

    if (id) {
      const updateData = {
        nome, banda, ano, imagem: imagemFinal, favorita, obs, faixas,
        media, somaNotas, nmp, duracao, duracaoSegundos, atualizadoEm: agoraISO
      };
      await updateDoc(doc(db, "albuns", id), updateData);
      mostrarToast("Álbum atualizado com sucesso!");
    } else {
      const idadeCadastro = calcularIdade(new Date());
      const novoData = {
        nome, banda, ano, imagem: imagemFinal, favorita, obs, faixas,
        media, somaNotas, nmp,
        duracao,
        duracaoSegundos,
        idadeNoCadastro: idadeCadastro,
        criadoEm: agoraISO,
        atualizadoEm: agoraISO,
        userId: usuarioAtual.uid
      };
      await addDoc(collection(db, "albuns"), novoData);
      mostrarToast("Álbum cadastrado com sucesso!");
    }

    prepararNovoAlbum();
    navegarPara('sec-dashboard');

  } catch (erro) {
    mostrarToast("Erro ao salvar!", "erro");
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar Álbum";
  }
});

// LISTAR E RENDERIZAR
async function carregarAlbuns() {
  const grid = document.getElementById('lista-albuns');
  grid.innerHTML = 'Carregando...';

  try {
    const q = query(collection(db, "albuns"), where("userId", "==", usuarioAtual.uid));
    const snapshot = await getDocs(q);

    todosOsAlbuns = [];
    snapshot.forEach(docSnap => {
      todosOsAlbuns.push({ id: docSnap.id, ...docSnap.data() });
    });

    paginaAtual = 1;
    aplicarFiltrosEBuscar();

  } catch (erro) {
    grid.innerHTML = '<p style="color: red;">Erro ao carregar álbuns.</p>';
  }
}

window.aplicarFiltrosEBuscar = function() {
  const termo = document.getElementById('filtro-busca').value.toLowerCase().trim();
  const anoFiltro = document.getElementById('filtro-ano').value;
  const ordem = document.getElementById('filtro-ordem').value;

  albunsFiltrados = todosOsAlbuns.filter(album => {
    const bateNome = album.nome.toLowerCase().includes(termo);
    const bateBanda = (album.banda || '').toLowerCase().includes(termo);
    const bateAno = anoFiltro ? album.ano == anoFiltro : true;
    return (bateNome || bateBanda) && bateAno;
  });

  albunsFiltrados.sort((a, b) => {
    if (ordem === 'add-desc') return new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0);
    if (ordem === 'add-asc') return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
    if (ordem === 'nota-desc') return b.media - a.media;
    if (ordem === 'nota-asc') return a.media - b.media;
    if (ordem === 'ano-desc') return b.ano - a.ano;
    if (ordem === 'ano-asc') return a.ano - b.ano;
  });

  paginaAtual = 1;
  renderizarPagina();
};

function renderizarPagina() {
  const grid = document.getElementById('lista-albuns');
  grid.innerHTML = '';

  if (albunsFiltrados.length === 0) {
    grid.innerHTML = '<p>Nenhum álbum encontrado.</p>';
    document.getElementById('info-pagina').innerText = 'Página 0 de 0';
    document.getElementById('btn-pag-ant').disabled = true;
    document.getElementById('btn-pag-prox').disabled = true;
    return;
  }

  const totalPaginas = Math.ceil(albunsFiltrados.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const albunsExibidos = albunsFiltrados.slice(inicio, fim);

  albunsExibidos.forEach(data => {
    const dataCriacao = data.criadoEm ? new Date(data.criadoEm).toLocaleDateString('pt-BR') : 'N/A';
    const dataEdicao = data.atualizadoEm ? new Date(data.atualizadoEm).toLocaleDateString('pt-BR') : 'N/A';

    const temObs = data.obs && data.obs.trim().length > 0;
    const duracaoAlbum = String(data.duracao || (data.duracaoSegundos ? formatarDuracao(data.duracaoSegundos) : '')).trim();

    const card = document.createElement('div');
    card.className = 'card-album';
    card.innerHTML = `
      <div class="card-cabecalho">
        <div class="badges-notas">
          <span class="nota-badge">${data.media}</span>
          <span class="badge-nmp">${data.nmp || 0}% NMP</span>
        </div>
      </div>
      <h3>${data.nome} (${data.ano})</h3>
      <p class="album-artist">${data.banda || 'Banda não informada'}</p>

      ${data.imagem ? `<img src="${data.imagem}" alt="Capa" onerror="this.src='https://via.placeholder.com/200?text=Sem+Capa'">` : ''}

      <p><strong>Soma das Notas:</strong> ${data.somaNotas ?? 'N/A'}</p>
      <p><strong>Música favorita:</strong> ${data.favorita || 'N/A'}</p>
      <p><strong>Faixas:</strong> ${data.faixas.length}</p>
      ${duracaoAlbum ? `<p><strong>Duração:</strong> ${escaparHtml(duracaoAlbum)}</p>` : ''}
      <p><strong>Idade no cadastro:</strong> ${data.idadeNoCadastro ?? 'N/A'} anos</p>

      ${temObs ? `<button type="button" class="btn-obs" data-album-obs="${data.id}">Ver observações</button>` : ''}

      <div class="card-datas">
        Cadastrado: ${dataCriacao}<br>
        Última modificação: ${dataEdicao}
      </div>

      <div class="card-acoes">
        <button onclick="editarAlbum('${data.id}')" class="btn-alerta">Editar</button>
        <button onclick="deletarAlbum('${data.id}')" class="btn-perigo">Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('info-pagina').innerText = `Página ${paginaAtual} de ${totalPaginas}`;
  document.getElementById('btn-pag-ant').disabled = (paginaAtual === 1);
  document.getElementById('btn-pag-prox').disabled = (paginaAtual === totalPaginas);
}

document.getElementById('lista-albuns')?.addEventListener('click', async (event) => {
  const botao = event.target.closest('[data-album-obs]');
  if (!botao) return;
  const album = await getDoc(doc(db, 'albuns', botao.dataset.albumObs));
  if (album.exists()) window.abrirModalObs(album.data().obs || 'Nenhuma observação registrada.');
});

window.mudarPagina = function(direcao) {
  paginaAtual += direcao;
  renderizarPagina();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.editarAlbum = async function(id) {
  try {
    const docSnap = await getDoc(doc(db, "albuns", id));
    if (!docSnap.exists()) return mostrarToast("Álbum não encontrado!", "erro");

    const data = docSnap.data();
    document.getElementById('album-id').value = id;
    document.getElementById('album-nome').value = data.nome;
    document.getElementById('album-banda').value = data.banda || '';
    document.getElementById('album-ano').value = data.ano;
    document.getElementById('album-favorita').value = data.favorita || '';
    document.getElementById('album-obs').value = data.obs || '';
    definirTimerAudicao(data.duracaoSegundos || 0);
    document.getElementById('album-duracao').value = data.duracao || (data.duracaoSegundos ? formatarDuracao(data.duracaoSegundos) : '');

    if (data.imagem) {
      if (data.imagem.startsWith('data:image')) {
        imagemBase64Temp = data.imagem;
        document.getElementById('img-preview').src = data.imagem;
        document.getElementById('preview-container').classList.remove('escondido');
        document.getElementById('album-imagem').value = '';
      } else {
        document.getElementById('album-imagem').value = data.imagem;
        imagemBase64Temp = '';
        document.getElementById('preview-container').classList.add('escondido');
      }
    }

    const container = document.getElementById('container-faixas');
    container.innerHTML = '';
    data.faixas.forEach(f => addLinhaFaixa(f.nome, f.classificacao));

    document.getElementById('form-titulo').innerText = 'Editar Álbum';
    navegarPara('sec-novo-album');

  } catch (e) {
    mostrarToast("Erro ao carregar edição.", "erro");
  }
};

function escaparHtml(valor = '') {
  return String(valor).replace(/[&<>'"]/g, (caractere) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[caractere]));
}

async function carregarBandas() {
  const container = document.getElementById('lista-bandas');
  if (!container || !usuarioAtual) return;

  container.innerHTML = '<p class="empty-state">Carregando discografias...</p>';

  try {
    const snapshot = await getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid)));
    const grupos = new Map();

    snapshot.forEach((docSnap) => {
      const album = { id: docSnap.id, ...docSnap.data() };
      const nomeBanda = (album.banda || 'Banda não informada').trim();
      if (!grupos.has(nomeBanda)) grupos.set(nomeBanda, []);
      grupos.get(nomeBanda).push(album);
    });

    const bandas = Array.from(grupos.entries()).map(([nome, albuns]) => ({
      nome,
      albuns: albuns.sort((a, b) => Number(a.ano || 0) - Number(b.ano || 0)),
      media: albuns.reduce((total, album) => total + Number(album.media || 0), 0) / albuns.length
    })).sort((a, b) => b.media - a.media);

    if (!bandas.length) {
      container.innerHTML = '<p class="empty-state">Cadastre um álbum para visualizar as discografias.</p>';
      return;
    }

    container.innerHTML = bandas.map((banda) => `
      <article class="banda-card">
        <div class="banda-card-header">
          <div>
            <h3>${escaparHtml(banda.nome)}</h3>
            <p>${banda.albuns.length} álbum(ns) na coleção</p>
          </div>
          <strong class="banda-media">${banda.media.toFixed(2)}<small>/10</small></strong>
        </div>
        <div class="discografia-grafico" aria-label="Notas da discografia de ${escaparHtml(banda.nome)}">
          ${banda.albuns.map((album) => {
            const nota = Math.max(0, Math.min(10, Number(album.media || 0)));
            return `
              <div class="barra-album">
                <div class="barra-album-meta">
                  <span title="${escaparHtml(album.nome || 'Álbum sem nome')}">${escaparHtml(album.nome || 'Álbum sem nome')} - ${escaparHtml(album.ano || 'N/A')}</span>
                  <strong>${nota.toFixed(1)}</strong>
                </div>
                <div class="barra-album-trilho"><span style="width: ${nota * 10}%"></span></div>
              </div>
            `;
          }).join('')}
        </div>
      </article>
    `).join('');
  } catch (erro) {
    console.error('Erro ao carregar bandas:', erro);
    container.innerHTML = '<p class="empty-state">Não foi possível carregar as discografias.</p>';
  }
}

function calcularTempoLeitura(inicio, conclusao) {
  const dataInicio = new Date(inicio);
  const dataConclusao = new Date(conclusao);
  if (!inicio || !conclusao || Number.isNaN(dataInicio.getTime()) || Number.isNaN(dataConclusao.getTime()) || dataConclusao < dataInicio) return null;

  let cursor = new Date(dataInicio);
  let anos = 0;
  let meses = 0;
  while (new Date(cursor.getFullYear() + 1, cursor.getMonth(), cursor.getDate(), cursor.getHours(), cursor.getMinutes(), cursor.getSeconds()) <= dataConclusao) {
    cursor.setFullYear(cursor.getFullYear() + 1);
    anos += 1;
  }
  while (new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate(), cursor.getHours(), cursor.getMinutes(), cursor.getSeconds()) <= dataConclusao) {
    cursor.setMonth(cursor.getMonth() + 1);
    meses += 1;
  }
  let segundos = Math.floor((dataConclusao - cursor) / 1000);
  const dias = Math.floor(segundos / 86400);
  segundos %= 86400;
  const horas = Math.floor(segundos / 3600);
  segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  segundos %= 60;
  const partes = [];
  if (anos) partes.push(`${anos} ano${anos === 1 ? '' : 's'}`);
  if (meses) partes.push(`${meses} mês${meses === 1 ? '' : 'es'}`);
  if (dias) partes.push(`${dias} dia${dias === 1 ? '' : 's'}`);
  if (horas) partes.push(`${horas} hora${horas === 1 ? '' : 's'}`);
  if (minutos) partes.push(`${minutos} min`);
  if (segundos || !partes.length) partes.push(`${segundos} seg`);
  return { segundosTotais: Math.floor((dataConclusao - dataInicio) / 1000), texto: partes.join(', ') };
}

function lerArquivoComoDataUrl(input) {
  const arquivo = input?.files?.[0];
  if (!arquivo) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = reject;
    leitor.readAsDataURL(arquivo);
  });
}

function formatarStatusLeitura(status) {
  return ({ lido: 'Lido', lendo: 'Lendo', fila: 'Na Fila' })[status] || status || 'Na Fila';
}

function renderizarQuadrinhosLivros(lista) {
  const container = document.getElementById('lista-quadrinhos');
  if (!container) return;
  const totalPaginas = Math.max(1, Math.ceil(lista.length / OBRAS_POR_PAGINA));
  quadrinhosPagina = Math.min(Math.max(1, quadrinhosPagina), totalPaginas);
  const inicio = (quadrinhosPagina - 1) * OBRAS_POR_PAGINA;
  const pagina = lista.slice(inicio, inicio + OBRAS_POR_PAGINA);
  container.innerHTML = pagina.length ? pagina.map((item) => `
    <article class="card-album leitura-card">
      ${item.capa ? `<img src="${escaparHtml(item.capa)}" alt="Capa de ${escaparHtml(item.titulo)}">` : ''}
      <div class="card-cabecalho"><span class="badge-nmp">${item.tipo === 'livro' ? 'Livro' : 'Quadrinho'}</span><span class="nota-badge">${item.nota ?? '-'}/10</span></div>
      <h3>${escaparHtml(item.titulo)}</h3>
      <p class="album-artist">${escaparHtml(item.editora || 'Editora não informada')}</p>
      <p>Status: ${formatarStatusLeitura(item.status)}</p>
      ${Number(item.paginas) > 0 ? `<p>Páginas: ${Number(item.paginas)}</p>` : ''}
      ${item.tempoLeituraTexto ? `<p>Tempo de leitura: ${escaparHtml(item.tempoLeituraTexto)}</p>` : ''}
      ${item.personagem ? `<p>História: ${escaparHtml(item.personagem)}</p>` : ''}
      <div class="card-acoes"><button type="button" class="btn-alerta" data-leitura-editar="${item.id}">Editar</button><button type="button" class="btn-perigo" data-leitura-excluir="${item.id}">Excluir</button></div>
    </article>
  `).join('') : '<p class="empty-state">Nenhum quadrinho ou livro cadastrado.</p>';
  const info = document.getElementById('info-pagina-quadrinhos');
  const anterior = document.getElementById('btn-pagina-quadrinhos-anterior');
  const proxima = document.getElementById('btn-pagina-quadrinhos-proxima');
  if (info) info.textContent = `Página ${quadrinhosPagina} de ${totalPaginas}`;
  if (anterior) anterior.disabled = quadrinhosPagina <= 1;
  if (proxima) proxima.disabled = quadrinhosPagina >= totalPaginas;
}

function renderizarEstatisticasLeitura(lista) {
  const hqs = lista.filter((item) => String(item.tipo || '').toLowerCase() === 'quadrinho');
  const livros = lista.filter((item) => String(item.tipo || '').toLowerCase() === 'livro');
  document.getElementById('leitura-total-hqs').textContent = hqs.length;
  document.getElementById('leitura-total-livros').textContent = livros.length;
  document.getElementById('leitura-hqs-lidas').textContent = hqs.filter((item) => item.status === 'lido').length;
  document.getElementById('leitura-livros-lidos').textContent = livros.filter((item) => item.status === 'lido').length;

  const statusConfig = [
    { chave: 'lido', rotulo: 'Lido' },
    { chave: 'lendo', rotulo: 'Lendo' },
    { chave: 'fila', rotulo: 'Na Fila' }
  ];
  const statusDados = statusConfig.map(({ chave }) => lista.filter((item) => String(item.status || 'fila').toLowerCase() === chave).length);
  const editorasMap = new Map();
  lista.forEach((item) => {
    const editora = String(item.editora || '').trim() || 'Outras';
    editorasMap.set(editora, (editorasMap.get(editora) || 0) + 1);
  });
  const editorasOrdenadas = [...editorasMap.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const contagemPersonagens = new Map();
  lista.forEach((item) => {
    const personagem = String(item.personagem || '').trim() || 'Sem personagem';
    contagemPersonagens.set(personagem, (contagemPersonagens.get(personagem) || 0) + 1);
  });
  const personagensOrdenados = [...contagemPersonagens.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (leituraStatusChart) leituraStatusChart.destroy();
  if (leituraEditoraChart) leituraEditoraChart.destroy();
  if (leituraPersonagensChart) leituraPersonagensChart.destroy();

  const contextoStatus = document.getElementById('graficoLeituraStatus')?.getContext('2d');
  if (contextoStatus) {
    leituraStatusChart = new Chart(contextoStatus, {
      type: 'doughnut',
      data: {
        labels: statusConfig.map(({ rotulo }) => rotulo),
        datasets: [{ data: statusDados, backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b'], borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e5e7eb' } } }
      }
    });
  }

  const contextoEditoras = document.getElementById('graficoLeituraEditoras')?.getContext('2d');
  if (contextoEditoras) {
    leituraEditoraChart = new Chart(contextoEditoras, {
      type: 'bar',
      data: {
        labels: editorasOrdenadas.map(([nome]) => nome),
        datasets: [{ label: 'Obras', data: editorasOrdenadas.map(([, total]) => total), backgroundColor: '#3b82f6', borderRadius: 6 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#e5e7eb', autoSkip: false, maxRotation: 35, minRotation: 0 }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { color: '#e5e7eb', precision: 0 }, grid: { color: 'rgba(255,255,255,0.08)' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  const contextoPersonagens = document.getElementById('graficoLeituraPersonagens')?.getContext('2d');
  if (contextoPersonagens) {
    leituraPersonagensChart = new Chart(contextoPersonagens, {
      type: 'bar',
      data: { labels: personagensOrdenados.map(([nome]) => nome), datasets: [{ label: 'Obras', data: personagensOrdenados.map(([, total]) => total), backgroundColor: '#3b82f6', borderRadius: 6, barThickness: 22 }] },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 8, right: 12, top: 8, bottom: 8 } },
        scales: {
          x: { beginAtZero: true, ticks: { color: '#e5e7eb', precision: 0 }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#e5e7eb', autoSkip: false, callback: (valor) => { const label = personagensOrdenados[valor]?.[0] || ''; return label.length > 22 ? [label.slice(0, 20) + '…'] : label; } }, grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function carregarQuadrinhosLivros() {
  if (!usuarioAtual) return;
  if (quadrinhosUnsubscribe) return;
  const consulta = query(collection(db, 'quadrinhos'), where('userId', '==', usuarioAtual.uid));
  quadrinhosUnsubscribe = onSnapshot(consulta, (snapshot) => {
    quadrinhosLista = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => new Date(b.atualizadoEm || b.criadoEm || 0) - new Date(a.atualizadoEm || a.criadoEm || 0));
    renderizarQuadrinhosLivros(quadrinhosLista);
    renderizarEstatisticasLeitura(quadrinhosLista);
  }, (erro) => {
    console.error('Erro ao acompanhar quadrinhos:', erro);
    mostrarToast('Não foi possível atualizar as obras.', 'erro');
  });
}

function preencherFormularioLeitura(item) {
  document.getElementById('quadrinho-id').value = item.id || '';
  document.getElementById('quadrinho-tipo').value = item.tipo || 'quadrinho';
  document.getElementById('quadrinho-titulo').value = item.titulo || '';
  document.getElementById('quadrinho-editora').value = item.editora || '';
  document.getElementById('quadrinho-personagem').value = item.personagem || '';
  document.getElementById('quadrinho-status').value = item.status || 'fila';
  document.getElementById('quadrinho-nota').value = item.nota ?? '';
  document.getElementById('quadrinho-paginas').value = item.paginas ?? '';
  document.getElementById('quadrinho-inicio').value = item.dataInicio || '';
  document.getElementById('quadrinho-conclusao').value = item.dataConclusao || '';
  document.getElementById('quadrinho-capa').value = item.capa?.startsWith('data:') ? '' : item.capa || '';
  document.getElementById('quadrinho-obs').value = item.observacoes || '';
  document.getElementById('campos-hq').classList.toggle('escondido', item.tipo === 'livro');
}

document.getElementById('btn-novo-quadrinho')?.addEventListener('click', () => {
  document.getElementById('form-quadrinho').reset();
  document.getElementById('quadrinho-id').value = '';
  document.getElementById('quadrinho-inicio').value = new Date().toISOString().slice(0, 16);
  document.getElementById('quadrinho-conclusao').value = '';
  document.getElementById('campos-hq').classList.remove('escondido');
  controlarFormularioRecolhivel('form-quadrinho', true);
  document.getElementById('quadrinho-titulo').focus();
});
document.getElementById('quadrinho-tipo')?.addEventListener('change', (event) => document.getElementById('campos-hq').classList.toggle('escondido', event.target.value === 'livro'));
document.getElementById('quadrinho-status')?.addEventListener('change', (event) => {
  const conclusao = document.getElementById('quadrinho-conclusao');
  if (event.target.value === 'lido' && conclusao) conclusao.value = new Date().toISOString().slice(0, 16);
});
document.getElementById('btn-cancelar-quadrinho')?.addEventListener('click', () => controlarFormularioRecolhivel('form-quadrinho', false));
document.getElementById('btn-pagina-quadrinhos-anterior')?.addEventListener('click', () => {
  quadrinhosPagina = Math.max(1, quadrinhosPagina - 1);
  renderizarQuadrinhosLivros(quadrinhosLista);
});
document.getElementById('btn-pagina-quadrinhos-proxima')?.addEventListener('click', () => {
  quadrinhosPagina += 1;
  renderizarQuadrinhosLivros(quadrinhosLista);
});
document.getElementById('btn-toggle-estatisticas-leitura')?.addEventListener('click', () => {
  const painel = document.getElementById('leitura-estatisticas');
  const aberto = painel.classList.toggle('escondido') === false;
  document.getElementById('btn-toggle-estatisticas-leitura').textContent = aberto ? 'Ocultar Estatísticas & Gráficos' : 'Ver Estatísticas & Gráficos 📊';
  if (aberto) renderizarEstatisticasLeitura(quadrinhosLista);
});
document.getElementById('form-quadrinho')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('quadrinho-id').value;
  const tipo = document.getElementById('quadrinho-tipo').value;
  const titulo = document.getElementById('quadrinho-titulo').value.trim();
  const dataInicio = document.getElementById('quadrinho-inicio').value || new Date().toISOString().slice(0, 16);
  let dataConclusao = document.getElementById('quadrinho-conclusao').value;
  const status = document.getElementById('quadrinho-status').value;
  if (!titulo) return mostrarToast('Informe o título da obra.', 'erro');
  let anterior = {};
  if (id) anterior = (await getDoc(doc(db, 'quadrinhos', id))).data() || {};
  if (status === 'lido' && !dataConclusao) dataConclusao = new Date().toISOString().slice(0, 16);
  const capaArquivo = await lerArquivoComoDataUrl(document.getElementById('quadrinho-arquivo'));
  const tempo = status === 'lido' ? calcularTempoLeitura(dataInicio, dataConclusao) : null;
  const dados = { tipo, titulo, status, nota: Number(document.getElementById('quadrinho-nota').value) || 0, paginas: Number(document.getElementById('quadrinho-paginas').value) || 0, capa: capaArquivo || document.getElementById('quadrinho-capa').value.trim(), dataInicio, dataConclusao, duracaoSegundos: tempo?.segundosTotais || 0, tempoLeituraTexto: tempo?.texto || '', editora: tipo === 'quadrinho' ? document.getElementById('quadrinho-editora').value.trim() : '', personagem: tipo === 'quadrinho' ? document.getElementById('quadrinho-personagem').value.trim() : '', observacoes: document.getElementById('quadrinho-obs').value.trim(), userId: usuarioAtual.uid, atualizadoEm: new Date().toISOString() };
  if (id) {
    await updateDoc(doc(db, 'quadrinhos', id), dados);
  } else {
    const novo = await addDoc(collection(db, 'quadrinhos'), { ...dados, criadoEm: new Date().toISOString() });
  }
  controlarFormularioRecolhivel('form-quadrinho', false);
  await carregarQuadrinhosLivros();
});
document.getElementById('lista-quadrinhos')?.addEventListener('click', async (event) => {
  const editar = event.target.closest('[data-leitura-editar]');
  const excluir = event.target.closest('[data-leitura-excluir]');
  if (editar) {
    const item = await getDoc(doc(db, 'quadrinhos', editar.dataset.leituraEditar));
    if (item.exists()) { preencherFormularioLeitura({ id: item.id, ...item.data() }); controlarFormularioRecolhivel('form-quadrinho', true); }
  }
  if (excluir && confirm('Excluir esta obra?')) {
    await deleteDoc(doc(db, 'quadrinhos', excluir.dataset.leituraExcluir));
    await carregarQuadrinhosLivros();
  }
});

window.deletarAlbum = async function(id) {
  if (confirm("Deseja mesmo apagar este álbum?")) {
    try {
      await deleteDoc(doc(db, "albuns", id));
      mostrarToast("Álbum removido!");
      carregarAlbuns();
    } catch (e) {
      mostrarToast("Erro ao excluir.", "erro");
    }
  }
};

function atualizarMetricasAudicao(albuns) {
  const elementos = {
    medio: document.getElementById('stat-tempo-medio'),
    longo: document.getElementById('stat-album-longo'),
    curto: document.getElementById('stat-album-curto'),
    correlacao: document.getElementById('stat-correlacao-duracao')
  };
  const comDuracao = albuns
    .map((album) => ({
      ...album,
      duracaoSegundos: converterDuracaoParaSegundos(album.duracao, album.duracaoSegundos)
    }))
    .filter((album) => album.duracaoSegundos > 0);

  if (!comDuracao.length) {
    Object.values(elementos).forEach((elemento) => {
      if (elemento) elemento.textContent = '-';
    });
    return;
  }

  const totalSegundos = comDuracao.reduce((total, album) => total + Number(album.duracaoSegundos), 0);
  const mediaSegundos = Math.round(totalSegundos / comDuracao.length);
  const maisLongo = [...comDuracao].sort((a, b) => b.duracaoSegundos - a.duracaoSegundos)[0];
  const maisCurto = [...comDuracao].sort((a, b) => a.duracaoSegundos - b.duracaoSegundos)[0];

  if (elementos.medio) elementos.medio.textContent = formatarDuracao(mediaSegundos);
  if (elementos.longo) elementos.longo.textContent = `${maisLongo.nome} (${formatarDuracao(maisLongo.duracaoSegundos)})`;
  if (elementos.curto) elementos.curto.textContent = `${maisCurto.nome} (${formatarDuracao(maisCurto.duracaoSegundos)})`;

  if (comDuracao.length < 2) {
    if (elementos.correlacao) elementos.correlacao.textContent = 'Dados insuficientes';
    return;
  }

  const duracoes = comDuracao.map((album) => Number(album.duracaoSegundos));
  const notas = comDuracao.map((album) => Number(album.media || 0));
  const mediaDuracao = duracoes.reduce((total, valor) => total + valor, 0) / duracoes.length;
  const mediaNota = notas.reduce((total, valor) => total + valor, 0) / notas.length;
  const numerador = duracoes.reduce((total, duracao, index) => total + (duracao - mediaDuracao) * (notas[index] - mediaNota), 0);
  const denominador = Math.sqrt(
    duracoes.reduce((total, duracao) => total + (duracao - mediaDuracao) ** 2, 0) *
    notas.reduce((total, nota) => total + (nota - mediaNota) ** 2, 0)
  );
  const correlacao = denominador ? numerador / denominador : 0;
  const leitura = correlacao >= 0.2 ? 'notas maiores' : correlacao <= -0.2 ? 'notas menores' : 'relação fraca';

  if (elementos.correlacao) elementos.correlacao.textContent = `${leitura} (r = ${correlacao.toFixed(2)})`;
}

// ESTATÍSTICAS
async function carregarEstatisticas() {
  const q = query(collection(db, "albuns"), where("userId", "==", usuarioAtual.uid));
  const snapshot = await getDocs(q);

  let albuns = [];
  snapshot.forEach(docSnap => albuns.push(docSnap.data()));

  document.getElementById('stat-total').innerText = albuns.length;

  if (albuns.length === 0) {
    document.getElementById('stat-melhor').innerText = '-';
    document.getElementById('stat-pior').innerText = '-';
    document.getElementById('stat-banda-top').innerText = '-';
    document.getElementById('stat-banda-pior').innerText = '-';
    document.getElementById('stat-bandas-diferentes').innerText = '0';
    document.getElementById('stat-decada-media').innerText = '-';
    document.getElementById('stat-decada-qtd').innerText = '-';
    document.getElementById('stat-dia-ativo').innerText = '-';
    document.getElementById('stat-dias-off').innerText = '-';
    document.getElementById('stat-media-faixas').innerText = '0';
    document.getElementById('stat-album-extenso').innerText = '-';
    document.getElementById('stat-album-enxuto').innerText = '-';
    document.getElementById('stat-total-faixas').innerText = '0';
    atualizarMetricasAudicao([]);
    return;
  }

  atualizarMetricasAudicao(albuns);

  const albunsPorNota = [...albuns].sort((a, b) => b.media - a.media);
  document.getElementById('stat-melhor').innerText = `${albunsPorNota[0].nome} (${albunsPorNota[0].media})`;
  document.getElementById('stat-pior').innerText = `${albunsPorNota[albunsPorNota.length - 1].nome} (${albunsPorNota[albunsPorNota.length - 1].media})`;

  const contagemBandas = {};
  albuns.forEach(a => {
    const b = a.banda ? a.banda.trim() : 'Desconhecida';
    contagemBandas[b] = (contagemBandas[b] || 0) + 1;
  });
  const bandaTop = Object.keys(contagemBandas).reduce((a, b) => contagemBandas[a] > contagemBandas[b] ? a : b);
  document.getElementById('stat-banda-top').innerText = `${bandaTop} (${contagemBandas[bandaTop]} álbuns)`;
  document.getElementById('stat-bandas-diferentes').innerText = Object.keys(contagemBandas).length;

  const totalFaixas = albuns.reduce((total, album) => total + (Array.isArray(album.faixas) ? album.faixas.length : 0), 0);
  const mediaFaixas = totalFaixas / albuns.length;
  const albumExtenso = [...albuns].sort((a, b) => (Array.isArray(b.faixas) ? b.faixas.length : 0) - (Array.isArray(a.faixas) ? a.faixas.length : 0))[0];
  const albumEnxuto = [...albuns].sort((a, b) => (Array.isArray(a.faixas) ? a.faixas.length : 0) - (Array.isArray(b.faixas) ? b.faixas.length : 0))[0];

  document.getElementById('stat-media-faixas').innerText = `${mediaFaixas.toFixed(1)} faixas/álbum`;
  document.getElementById('stat-album-extenso').innerText = `${albumExtenso?.nome || '-'} (${albumExtenso?.faixas?.length || 0})`;
  document.getElementById('stat-album-enxuto').innerText = `${albumEnxuto?.nome || '-'} (${albumEnxuto?.faixas?.length || 0})`;
  document.getElementById('stat-total-faixas').innerText = totalFaixas;

  const decadas = {};
  albuns.forEach(a => {
    if (a.ano) {
      const decada = Math.floor(a.ano / 10) * 10;
      if (!decadas[decada]) decadas[decada] = { soma: 0, qtd: 0 };
      decadas[decada].soma += a.media;
      decadas[decada].qtd += 1;
    }
  });

  let decadaMaiorMedia = '-';
  let maiorMedia = 0;
  let decadaMaisQtd = '-';
  let maiorQtd = 0;

  const labelsDecadas = Object.keys(decadas).sort();
  const mediasDecadas = labelsDecadas.map(d => {
    const qtd = decadas[d].qtd;
    const media = parseFloat((decadas[d].soma / qtd).toFixed(2));

    if (media > maiorMedia) {
      maiorMedia = media;
      decadaMaiorMedia = `${d}s (${media} de média)`;
    }

    if (qtd > maiorQtd) {
      maiorQtd = qtd;
      decadaMaisQtd = `${d}s (${qtd} álbuns)`;
    }

    return media;
  });

  document.getElementById('stat-decada-media').innerText = decadaMaiorMedia;
  document.getElementById('stat-decada-qtd').innerText = decadaMaisQtd;

  const datasContagem = {};
  let dataMaisRecente = null;

  albuns.forEach(a => {
    if (a.criadoEm) {
      const dataObj = new Date(a.criadoEm);
      const dataFormatada = dataObj.toLocaleDateString('pt-BR');
      datasContagem[dataFormatada] = (datasContagem[dataFormatada] || 0) + 1;

      if (!dataMaisRecente || dataObj > dataMaisRecente) {
        dataMaisRecente = dataObj;
      }
    }
  });

  if (Object.keys(datasContagem).length > 0) {
    const diaMaisAtivo = Object.keys(datasContagem).reduce((a, b) => datasContagem[a] > datasContagem[b] ? a : b);
    document.getElementById('stat-dia-ativo').innerText = `${diaMaisAtivo} (${datasContagem[diaMaisAtivo]} add)`;
  } else {
    document.getElementById('stat-dia-ativo').innerText = '-';
  }

  if (dataMaisRecente) {
    const hoje = new Date();
    const diffTempo = Math.abs(hoje - dataMaisRecente);
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      document.getElementById('stat-dias-off').innerText = 'Hoje!';
    } else {
      document.getElementById('stat-dias-off').innerText = `Há ${diffDias} dia(s)`;
    }
  } else {
    document.getElementById('stat-dias-off').innerText = '-';
  }

  const bandasResumo = Object.entries(contagemBandas).map(([banda, quantidade]) => {
    const albunsDaBanda = albuns.filter(album => (album.banda || '').trim() === banda);
    const somaMedia = albunsDaBanda.reduce((total, album) => total + Number(album.media || 0), 0);
    const mediaBanda = albunsDaBanda.length ? somaMedia / albunsDaBanda.length : 0;
    return {
      banda,
      quantidade,
      media: Number(mediaBanda.toFixed(2))
    };
  }).sort((a, b) => b.media - a.media || b.quantidade - a.quantidade);

  // Calcular banda com a menor nota média
  const bandaPior = bandasResumo[bandasResumo.length - 1];
  document.getElementById('stat-banda-pior').innerText = `${bandaPior.banda} (${bandaPior.media.toFixed(2)}/10)`;

  const bandasVisiveis = bandasResumo.slice(0, 12);
  let bandasAgrupadas = [...bandasVisiveis];

  if (bandasResumo.length > 12) {
    const demais = bandasResumo.slice(12);
    const quantidadeRestante = demais.reduce((total, item) => total + item.quantidade, 0);
    const mediaRestante = demais.length
      ? demais.reduce((total, item) => total + item.media * item.quantidade, 0) / quantidadeRestante
      : 0;

    bandasAgrupadas.push({
      banda: 'Outras',
      quantidade: quantidadeRestante,
      media: Number(mediaRestante.toFixed(2))
    });
  }

  const faixaMediaPorBanda = bandasAgrupadas.length ? bandasAgrupadas.map(item => item.media) : [0];
  const labelsBandas = bandasAgrupadas.length ? bandasAgrupadas.map(item => item.banda) : ['Sem dados'];

  const graficoBandasCtx = document.getElementById('graficoBandas')?.getContext('2d');
  if (window.graficoBandasChart) window.graficoBandasChart.destroy();

  if (graficoBandasCtx) {
    const labelsBandasCurtas = labelsBandas.map(label => {
      if (label === 'Outras') return 'Outras';
      return label.length > 18 ? `${label.slice(0, 15)}…` : label;
    });

    ajustarAlturaCanvas(graficoBandasCtx.canvas, labelsBandas.length, 360, 28, 620, 860);

    window.graficoBandasChart = new Chart(graficoBandasCtx, {
      type: 'bar',
      data: {
        labels: labelsBandasCurtas,
        datasets: [{
          label: 'Média da banda',
          data: faixaMediaPorBanda,
          backgroundColor: labelsBandas.map((_, index) => index === 0 ? '#22c55e' : index === labelsBandas.length - 1 ? '#f97316' : '#3b82f6'),
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        layout: { padding: { top: 8, right: 12, bottom: 8, left: 12 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const label = labelsBandas[items[0]?.dataIndex ?? 0] || '';
                return label;
              },
              label: (ctx) => `${ctx.parsed.x.toFixed(2)} / 10`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 10,
            ticks: {
              color: '#fff',
              stepSize: 2,
              maxTicksLimit: 8
            },
            grid: { color: 'rgba(255,255,255,0.08)' },
            title: { display: true, text: 'Nota média', color: '#fff' }
          },
          y: {
            ticks: {
              color: '#fff',
              autoSkip: false,
              maxTicksLimit: 12
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  const dispersaoBandasCtx = document.getElementById('graficoDispersaoBandas')?.getContext('2d');
  if (window.graficoDispersaoBandasChart) window.graficoDispersaoBandasChart.destroy();

  if (dispersaoBandasCtx) {
    const scatterData = bandasResumo.map(item => ({
      x: item.quantidade,
      y: item.media,
      r: Math.min(12, 5 + item.quantidade * 1.2)
    }));

    const maxXScatter = Math.max(8, ...scatterData.map(item => item.x), 1);
    ajustarAlturaCanvas(dispersaoBandasCtx.canvas, scatterData.length, 360, 36, 620, 780);

    window.graficoDispersaoBandasChart = new Chart(dispersaoBandasCtx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Bandas',
          data: scatterData,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: '#86efac',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${labelsBandas[ctx.dataIndex]} · ${ctx.raw.x} álbuns · ${ctx.raw.y.toFixed(2)}/10`
            }
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
              threshold: 10
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'xy',
              drag: false,
              limits: {
                x: { min: 0, max: Math.max(15, maxXScatter + 5) },
                y: { min: 0, max: 10 }
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: Math.max(15, maxXScatter + 5),
            title: { display: true, text: 'Quantidade de álbuns', color: '#fff' },
            ticks: {
              color: '#fff',
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: { color: 'rgba(255,255,255,0.08)' }
          },
          y: {
            min: 0,
            max: 10,
            title: { display: true, text: 'Nota média', color: '#fff' },
            ticks: { color: '#fff', stepSize: 2, maxTicksLimit: 8 },
            grid: { color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });
  }

  const ctxDecadas = document.getElementById('graficoDecadas').getContext('2d');
  if (window.graficoDecadasChart) window.graficoDecadasChart.destroy();

  ajustarAlturaCanvas(ctxDecadas.canvas, labelsDecadas.length, 360, 34, 620, 780);

  window.graficoDecadasChart = new Chart(ctxDecadas, {
    type: 'bar',
    data: {
      labels: labelsDecadas.map(d => `${d}s`),
      datasets: [{
        label: 'Nota Média por Década',
        data: mediasDecadas,
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 26
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        y: { min: 0, max: 10, ticks: { color: '#fff', maxTicksLimit: 8 } },
        x: {
          ticks: {
            color: '#fff',
            autoSkip: true,
            maxTicksLimit: 12
          }
        }
      }
    }
  });

  const albunsPorAno = [...albuns].filter(album => Number(album.ano) > 0).sort((a, b) => Number(a.ano || 0) - Number(b.ano || 0));
  const anosRegistrados = [...new Set(albunsPorAno.map(album => Number(album.ano || 0)))].sort((a, b) => a - b);
  const datasetLinha = albunsPorAno.map(album => ({
    x: Number(album.ano || 0),
    y: Number(album.media || 0),
    album: album.nome || 'Álbum sem nome',
    banda: album.banda || 'Banda desconhecida',
    ano: Number(album.ano || 0),
    nota: Number(album.media || 0)
  }));

  const xMin = anosRegistrados.length ? Math.min(...anosRegistrados) : 1900;
  const xMax = anosRegistrados.length ? Math.max(...anosRegistrados) : 2100;

  const ctx = document.getElementById('graficoCorrelacao')?.getContext('2d');
  if (window.meuGrafico) window.meuGrafico.destroy();

  if (!ctx) return;

  window.meuGrafico = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Nota Média do Álbum',
        data: datasetLinha,
        borderColor: '#1db954',
        backgroundColor: 'rgba(29, 185, 84, 0.15)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.3,
        cubicInterpolationMode: 'monotone'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      interaction: { mode: 'nearest', intersect: false },
      layout: { padding: { top: 10, right: 12, bottom: 16, left: 10 } },
      plugins: {
        legend: { labels: { color: '#fff' } },
        tooltip: {
          callbacks: {
            title: (items) => {
              const item = items[0]?.raw || {};
              return `${item.banda || 'Banda desconhecida'} · ${item.album || 'Álbum sem nome'}`;
            },
            label: (context) => {
              const item = context.raw || {};
              return `Ano: ${item.ano || '-'} · Nota: ${(item.nota ?? context.parsed.y).toFixed(1)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: xMin - 1,
          max: xMax + 1,
          title: { display: true, text: 'Ano de Lançamento', color: '#fff' },
          ticks: {
            color: '#fff',
            stepSize: 1,
            maxRotation: 0,
            minRotation: 0,
            callback: (value) => {
              const numero = Number(value);
              return anosRegistrados.includes(numero) ? String(numero) : '';
            }
          },
          grid: { color: 'rgba(255,255,255,0.08)' },
          border: { color: 'rgba(255,255,255,0.18)' }
        },
        y: {
          min: 0,
          max: 10,
          title: { display: true, text: 'Nota Média', color: '#fff' },
          ticks: {
            color: '#fff',
            stepSize: 2,
            maxTicksLimit: 6
          },
          grid: { color: 'rgba(255,255,255,0.08)' },
          border: { color: 'rgba(255,255,255,0.18)' }
        }
      }
    }
  });

  // Calcular tendência de notas
  const albunsPorData = [...albuns].filter(a => a.criadoEm).sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));
  if (albunsPorData.length >= 2) {
    const metadeAtual = albunsPorData.slice(-Math.floor(albunsPorData.length / 2));
    const metadeAnterior = albunsPorData.slice(0, Math.floor(albunsPorData.length / 2));
    
    const mediaAtual = metadeAtual.reduce((sum, a) => sum + (a.media || 0), 0) / metadeAtual.length;
    const mediaAnterior = metadeAnterior.reduce((sum, a) => sum + (a.media || 0), 0) / metadeAnterior.length;
    
    const diferenca = (mediaAtual - mediaAnterior).toFixed(2);
    const tendenciaIcon = document.getElementById('tendencia-icon');
    const tendenciaText = document.getElementById('stat-tendencia');
    
    if (diferenca > 0) {
      tendenciaIcon.textContent = '📈';
      tendenciaText.innerText = `+${diferenca} (Melhorando!)`;
      tendenciaText.style.color = 'var(--primary)';
    } else if (diferenca < 0) {
      tendenciaIcon.textContent = '📉';
      tendenciaText.innerText = `${diferenca} (Em queda)`;
      tendenciaText.style.color = 'var(--danger)';
    } else {
      tendenciaIcon.textContent = '➡️';
      tendenciaText.innerText = 'Estável';
      tendenciaText.style.color = 'var(--warning)';
    }
  }

  // Calcular mês mais produtivo
  const mesPorContagem = {};
  albuns.forEach(a => {
    if (a.criadoEm) {
      const data = new Date(a.criadoEm);
      const mesAno = data.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
      mesPorContagem[mesAno] = (mesPorContagem[mesAno] || 0) + 1;
    }
  });

  if (Object.keys(mesPorContagem).length > 0) {
    const mesMaisProdutivo = Object.keys(mesPorContagem).reduce((a, b) => mesPorContagem[a] > mesPorContagem[b] ? a : b);
    document.getElementById('stat-mes-produtivo').innerText = `${mesMaisProdutivo} (${mesPorContagem[mesMaisProdutivo]} álbuns)`;
  } else {
    document.getElementById('stat-mes-produtivo').innerText = '-';
  }

  // Carregar Timeline
  carregarTimeline(albuns);
}

// Timeline de histórico
function carregarTimeline(albuns) {
  const timelineContainer = document.getElementById('timeline-albuns');
  if (!timelineContainer) return;

  const albunsPorData = [...albuns].filter(a => a.criadoEm).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)).slice(0, 20);

  if (albunsPorData.length === 0) {
    timelineContainer.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Nenhum álbum adicionado ainda.</p>';
    return;
  }

  timelineContainer.innerHTML = albunsPorData.map(album => {
    const data = new Date(album.criadoEm);
    const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `
      <div class="timeline-item" onclick="navegarPara('sec-dashboard')">
        <div class="timeline-item-time">${dataFormatada}</div>
        <div class="timeline-item-content">
          <div class="timeline-item-title">${album.nome || 'Álbum sem nome'}</div>
          <div class="timeline-item-banda">${album.banda || 'Artista desconhecido'}</div>
          <div class="timeline-item-nota">⭐ ${album.media || '0'}/10</div>
        </div>
      </div>
    `;
  }).join('');
}

// Busca Rápida
window.executarBuscaRapida = function(query) {
  const inputBusca = document.getElementById('busca-rapida-stats');
  const resultContainer = document.getElementById('resultado-busca-rapida');

  if (!query) {
    query = inputBusca?.value?.toLowerCase() || '';
  }

  if (!query) {
    resultContainer.innerHTML = '';
    return;
  }

  // Buscar no Firebase
  const q = window.query(window.collection(window.db, 'albuns'), window.where('userId', '==', usuarioAtual.uid));
  window.getDocs(q).then(snapshot => {
    const resultados = [];
    snapshot.forEach(docSnap => {
      const album = docSnap.data();
      if (album.nome?.toLowerCase().includes(query) || 
          album.banda?.toLowerCase().includes(query) ||
          album.genero?.toLowerCase().includes(query)) {
        resultados.push(album);
      }
    });

    if (resultados.length === 0) {
      resultContainer.innerHTML = '<p style="color: var(--muted); padding: 10px;">Nenhum resultado encontrado.</p>';
      return;
    }

    resultContainer.innerHTML = resultados.slice(0, 8).map(album => `
      <div class="resultado-busca-item" onclick="alert('${album.nome} - ${album.banda}')">
        <div class="resultado-busca-item-titulo">${album.nome}</div>
        <div class="resultado-busca-item-info">${album.banda} • ${album.ano} • ⭐ ${album.media}/10</div>
      </div>
    `).join('');
  }).catch(err => {
    console.error('Erro na busca:', err);
    resultContainer.innerHTML = '<p style="color: var(--danger); padding: 10px;">Erro ao buscar álbuns.</p>';
  });
};

// Event listener para a busca rápida
if (document.getElementById('busca-rapida-stats')) {
  document.getElementById('busca-rapida-stats').addEventListener('input', (e) => {
    window.executarBuscaRapida(e.target.value);
  });
}

// Lista de Wallpapers disponíveis
const WALLPAPER_PADRAO = 'assets/andjustice.jpg';
const wallpapers = [
  'assets/andjustice.jpg',
  'assets/images (2).jfif',
  'assets/yh43bx8tdof21.jpg'
];

let indiceWallpaperAtual = 0;

function aplicarWallpaper(index) {
  const bgContainer = document.getElementById('wallpaper-container');
  if (bgContainer) {
    bgContainer.style.display = 'none';
    bgContainer.style.backgroundImage = 'none';
  }

  document.body.style.background = 'transparent';
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = 'transparent';

  const urls = wallpapers.length ? wallpapers : [WALLPAPER_PADRAO];
  const indice = Number.isInteger(index) ? index : indiceWallpaperAtual;
  indiceWallpaperAtual = (Math.abs(indice) % urls.length + urls.length) % urls.length;
}

function proximoWallpaper() {
  indiceWallpaperAtual = (indiceWallpaperAtual + 1) % wallpapers.length;
  aplicarWallpaper(indiceWallpaperAtual);
}

aplicarWallpaper(indiceWallpaperAtual);
setInterval(proximoWallpaper, 6000);

// Função para atualizar a Saudação conforme o horário do dia
function atualizarSaudacao() {
    const hora = new Date().getHours();
    const elemSaudacao = document.getElementById('lock-saudacao');
    const elemUserSaudacao = document.getElementById('boas-vindas-user');

    let textoSaudacao = "Boa noite!";

    if (hora >= 6 && hora < 12) {
        textoSaudacao = "Bom dia!";
    } else if (hora >= 12 && hora < 18) {
        textoSaudacao = "Boa tarde!";
    }

    if (elemSaudacao) elemSaudacao.textContent = textoSaudacao;
    if (elemUserSaudacao) elemUserSaudacao.textContent = `${textoSaudacao} Que tal ouvir algo hoje?`;
}

// Chamar ao inicializar o relógio
setInterval(atualizarSaudacao, 60000);
atualizarSaudacao();
// MODAL
window.abrirModalObs = function(texto) {
  const modal = document.getElementById('modal-obs');
  const campo = document.getElementById('modal-obs-texto');
  if (!modal || !campo) return;

  campo.innerText = texto || 'Nenhuma observação registrada.';
  modal.classList.remove('escondido');
};

window.fecharModalObs = function(forcar = false, evento = null) {
  const modal = document.getElementById('modal-obs');
  if (!modal) return;

  if (forcar || (evento && evento.target === modal)) {
    modal.classList.add('escondido');
  }
};

window.abrirModalDetalhes = function(album) {
  const modal = document.getElementById('modal-detalhes');
  const capa = document.getElementById('modal-album-capa');
  const nome = document.getElementById('modal-album-nome');
  const banda = document.getElementById('modal-album-banda');
  const meta = document.getElementById('modal-album-meta');
  const lista = document.getElementById('modal-lista-faixas');

  if (!modal || !capa || !nome || !banda || !meta || !lista) return;

  capa.src = album.imagem || 'https://via.placeholder.com/300x300?text=Sem+Capa';
  nome.textContent = album.nome || 'Álbum';
  banda.textContent = album.banda || 'Artista não informado';
  meta.textContent = `Ano: ${album.ano || 'N/A'} | Média: ${album.media ?? '0'} | NMP: ${album.nmp ?? 0}%`;

  lista.innerHTML = (album.faixas || []).map((faixa, index) => `
    <li>
      <span>${index + 1}. ${faixa.nome || 'Faixa sem nome'}</span>
      <strong>${faixa.classificacao || 'Boa'}</strong>
    </li>
  `).join('') || '<li>Nenhuma faixa cadastrada.</li>';

  modal.classList.remove('escondido');
};

window.fecharModalDetalhes = function(forcar = false, evento = null) {
  const modal = document.getElementById('modal-detalhes');
  if (!modal) return;

  if (forcar || (evento && evento.target === modal)) {
    modal.classList.add('escondido');
  }
};