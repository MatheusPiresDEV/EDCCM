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
if (typeof Chart !== 'undefined') Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;

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
let reaudicoesUnsubscribe = null;
let reaudicoesLista = [];
let reaudicoesLegadas = [];
let reaudicaoAlbunsBase = [];
let reaudicaoCatalogo = [];
let reaudicaoModoAtivo = false;
let reaudicaoAlbumOriginal = null;
let reaudicaoEditandoId = null;
let reaudicaoEvolucaoChart = null;
let reaudicaoComparacaoChart = null;
let graficoAtividadeEscutas = null;
let registrosEstatisticas = [];
let timerAudicaoSegundos = 0;
let timerAudicaoIntervalo = null;
let timerAudicaoId = null;
let timerAudicaoBaseSegundos = 0;
let timerAudicaoIniciadoEm = null;
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

function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function criarChaveAlbum(banda, album) {
  return `${normalizarTexto(banda)}_${normalizarTexto(album)}`;
}

function calcularCorPorNota(nota, menorNota = 0, maiorNota = 10) {
  const valor = Number.parseFloat(nota);
  if (!Number.isFinite(valor)) return '#7f8c8d';
  const inicio = { r: 0xe7, g: 0x4c, b: 0x3c };
  const fim = { r: 0xff, g: 0xd7, b: 0x00 };
  const intervalo = Number(maiorNota) - Number(menorNota);
  const fator = intervalo > 0 ? Math.max(0, Math.min(1, (valor - Number(menorNota)) / intervalo)) : 1;
  const canal = (chave) => Math.round(inicio[chave] + (fim[chave] - inicio[chave]) * fator).toString(16).padStart(2, '0');
  return `#${canal('r')}${canal('g')}${canal('b')}`;
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
          if (target === 'sec-novo-album') abrirModalNovoAlbumInteligente();
          else window.navegarPara(target);
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
    'sec-reaudicoes': 'sec-reaudicoes',
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
  if (idTela === 'sec-reaudicoes') renderizarGraficoReaudicoes();
};

window.prepararNovoAlbum = function() {
  reaudicaoModoAtivo = false;
  reaudicaoAlbumOriginal = null;
  reaudicaoEditandoId = null;
  document.getElementById('form-album').reset();
  document.getElementById('album-id').value = '';
  document.getElementById('container-faixas').innerHTML = '';
  document.getElementById('preview-container').classList.add('escondido');
  document.getElementById('form-titulo').innerText = 'Cadastrar Novo Álbum';
  document.getElementById('btn-salvar').innerText = 'Salvar Álbum';
  imagemBase64Temp = "";
  selecionarTimerAudicao(obterIdRascunhoTimer(), 0);
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
  if (reaudicoesUnsubscribe) reaudicoesUnsubscribe();
  quadrinhosUnsubscribe = null;
  reaudicoesUnsubscribe = null;
  reaudicoesLista = [];
  reaudicoesLegadas = [];
  reaudicaoCatalogo = [];

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
    subscribeReaudicoes();
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

// REAUDICOES E COMPARACOES
function converterDataReaudicao(valor) {
  if (!valor) return null;
  const data = typeof valor.toDate === 'function' ? valor.toDate() : new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarDataReaudicao(valor) {
  const data = converterDataReaudicao(valor);
  return data ? new Intl.DateTimeFormat('pt-BR').format(data) : 'Data indisponível';
}

function calcularIntervaloAudicoes(inicioValor, fimValor) {
  let inicio = converterDataReaudicao(inicioValor);
  let fim = converterDataReaudicao(fimValor);
  if (!inicio || !fim) return 'Intervalo indisponível';
  if (fim < inicio) [inicio, fim] = [fim, inicio];

  const adicionarMeses = (data, quantidade) => {
    const resultado = new Date(data);
    const diaOriginal = resultado.getDate();
    resultado.setDate(1);
    resultado.setMonth(resultado.getMonth() + quantidade);
    const ultimoDia = new Date(resultado.getFullYear(), resultado.getMonth() + 1, 0).getDate();
    resultado.setDate(Math.min(diaOriginal, ultimoDia));
    return resultado;
  };
  let anos = Math.max(0, fim.getFullYear() - inicio.getFullYear());
  if (adicionarMeses(inicio, anos * 12) > fim) anos -= 1;
  let cursor = adicionarMeses(inicio, anos * 12);
  let meses = Math.max(0, (fim.getFullYear() - cursor.getFullYear()) * 12 + fim.getMonth() - cursor.getMonth());
  if (adicionarMeses(cursor, meses) > fim) meses -= 1;
  cursor = adicionarMeses(cursor, meses);
  const dias = Math.floor((fim - cursor) / 86400000);
  const partes = [];
  if (anos) partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  if (meses) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
  if (dias || !partes.length) partes.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
  return partes.join(' e ');
}

function obterAlbumBasePorId(id) {
  return reaudicaoAlbunsBase.find((album) => album.id === id) || null;
}

function obterRefReaudicao(item) {
  return doc(db, item.colecaoDados || 'historico_reaudicoes', item.firestoreId || item.id);
}

function normalizarDocumentoReaudicao(id, dados, colecaoDados = 'historico_reaudicoes') {
  const notaAntigaValor = dados.notaAntiga ?? dados.notaOriginal ?? dados.notaCaderno ?? dados.mediaAntiga;
  const notaAtualValor = dados.notaAtual ?? dados.media ?? dados.nota;
  const albumNome = dados.nomeAlbum || dados.nomeCaderno || dados.album || dados.nome || dados.titulo || 'Álbum sem nome';
  const bandaNome = dados.nomeBanda || dados.bandaCaderno || dados.banda || dados.artista || 'Artista não informado';
  return {
    id: colecaoDados === 'historico_reaudicoes' ? id : `legacy-${id}`,
    firestoreId: id,
    colecaoDados,
    ...dados,
    album: albumNome,
    nomeAlbum: albumNome,
    banda: bandaNome,
    nomeBanda: bandaNome,
    notaAntiga: notaAntigaValor === null || notaAntigaValor === undefined || notaAntigaValor === '' ? null : Number.parseFloat(notaAntigaValor),
    notaOriginal: notaAntigaValor === null || notaAntigaValor === undefined || notaAntigaValor === '' ? null : Number.parseFloat(notaAntigaValor),
    nota: notaAtualValor === null || notaAtualValor === undefined || notaAtualValor === '' ? null : Number.parseFloat(notaAtualValor),
    notaAtual: notaAtualValor === null || notaAtualValor === undefined || notaAtualValor === '' ? null : Number.parseFloat(notaAtualValor),
    capa: dados.imagem || dados.capa || '',
    observacoes: dados.obs || dados.observacoes || '',
    dataReouvido: dados.dataReouvido || dados.criadoEm
  };
}

function obterFonteReaudicao(valor) {
  const [origem, id] = String(valor || '').split(':');
  if (!id) return null;
  return reaudicaoCatalogo.find((item) => item.tipoCatalogo === origem && item.id === id) || null;
}

function temNotaOriginal(item) {
  const valor = item.notaAntiga ?? item.notaOriginal ?? item.notaCaderno ?? item.mediaAntiga;
  return valor !== null && valor !== undefined && valor !== '' && Number.isFinite(Number.parseFloat(valor));
}

function registroVeioDoCaderno(registro) {
  return registro.origem === 'caderno_antigo' || registro.tipoOrigem === 'caderno_antigo' ||
    registro.categoria === 'caderno_antigo' || registro.tipo === 'caderno_antigo' ||
    registro.registroRapido === true || registro.isCaderno === true ||
    (temNotaOriginal(registro) && Boolean(registro.dataOriginal || registro.dataEscuta) && !registro.albumIdOriginal);
}

function criarCardCaderno(registro, id) {
  const nome = registro.nomeCaderno || registro.nomeAlbum || registro.album || registro.nome || 'Álbum sem nome';
  const banda = registro.bandaCaderno || registro.nomeBanda || registro.banda || 'Artista não informado';
  const notaAntiga = Number.parseFloat(registro.notaAntiga ?? registro.notaOriginal ?? registro.notaCaderno ?? registro.mediaAntiga ?? registro.media ?? registro.nota ?? 0);
  const notaAtualValor = registro.notaAtual ?? registro.mediaAtual ?? registro.mediaReaudicao ?? registro.notaReaudicao ?? (registro.integradoAlbumPrincipal ? registro.media ?? registro.nota : null);
  const notaAtual = notaAtualValor === null || notaAtualValor === undefined || notaAtualValor === '' ? null : Number.parseFloat(notaAtualValor);
  const imagem = registro.imagemCaderno || registro.capaCaderno || registro.imagem || registro.capa || '';
  const dataOriginal = converterDataReaudicao(registro.dataOriginal || registro.dataEscuta || registro.dataReouvido || registro.criadoEm);
  const dataAtual = converterDataReaudicao(registro.dataReouvido || registro.atualizadoEm);
  const base = {
    ...registro,
    id: `caderno-${id}`,
    historicoId: id,
    comparisonId: registro.id || id,
    firestoreId: registro.firestoreId || id,
    colecaoDados: registro.colecaoDados || 'historico_reaudicoes',
    origem: 'caderno_antigo',
    nome,
    banda,
    imagem,
    ano: registro.anoCaderno || registro.ano || null,
    notaAntiga,
    notaOriginal: notaAntiga,
    notaAtual,
    dataOriginal,
    dataReouvido: dataAtual,
    isCaderno: true,
    cadernoPareado: Number.isFinite(notaAtual),
    media: notaAntiga,
    nmp: Number((notaAntiga * 10).toFixed(1)),
    duracao: '',
    duracaoSegundos: 0,
    criadoEm: dataOriginal,
    atualizadoEm: dataOriginal
  };
  const cards = [base];
  if (Number.isFinite(notaAtual)) {
    cards.push({
      ...base,
      id: `reaudicao-${id}`,
      isCaderno: false,
      isReaudicao: true,
      media: notaAtual,
      nmp: Number((notaAtual * 10).toFixed(1)),
      somaNotas: registro.somaNotas,
      faixas: registro.faixas || [],
      duracao: registro.duracao || '',
      duracaoSegundos: Number(registro.duracaoSegundos || 0),
      criadoEm: dataAtual || dataOriginal,
      atualizadoEm: converterDataReaudicao(registro.atualizadoEm || dataAtual)
    });
  }
  return cards;
}

function preencherSelectAlbunsReaudicao() {
  const select = document.getElementById('reaudicao-album-existente');
  if (!select) return;
  const atual = select.value;
  select.innerHTML = '<option value="">Cadastrar manualmente</option>' + reaudicaoAlbunsBase
    .map((album) => `<option value="album:${escaparHtml(album.id)}">${escaparHtml(album.banda || 'Artista não informado')} — ${escaparHtml(album.nome || 'Álbum sem nome')}</option>`)
    .concat(reaudicaoCatalogo.filter((item) => item.tipoCatalogo === 'caderno')
      .map((item) => `<option value="caderno:${escaparHtml(item.id)}">Caderno antigo · ${escaparHtml(item.bandaCaderno || item.banda || 'Artista não informado')} — ${escaparHtml(item.nomeCaderno || item.nome || 'Álbum sem nome')} (${Number(item.notaAntiga || 0).toFixed(1)})</option>`))
    .join('');
  if ([...select.options].some((option) => option.value === atual)) select.value = atual;
}

async function carregarAlbunsParaReaudicao() {
  if (!usuarioAtual) return;
  const [albunsSnapshot, cadernoSnapshot] = await Promise.all([
    getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid))),
    getDocs(query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid)))
  ]);
  try {
    const legadoSnapshot = await getDocs(query(collection(db, 'reaudicoes'), where('userId', '==', usuarioAtual.uid)));
    reaudicoesLegadas = legadoSnapshot.docs.map((item) => normalizarDocumentoReaudicao(item.id, item.data(), 'reaudicoes'));
  } catch (erro) {
    console.info('Coleção legada de ré-audições indisponível.');
  }
  reaudicaoAlbunsBase = albunsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  reaudicaoCatalogo = [
    ...reaudicaoAlbunsBase.map((album) => ({ ...album, tipoCatalogo: 'album' })),
    ...cadernoSnapshot.docs.map((item) => ({ id: item.id, ...item.data(), tipoCatalogo: 'caderno' }))
      .filter((item) => registroVeioDoCaderno(item)),
    ...reaudicoesLegadas.filter((item) => registroVeioDoCaderno(item)).map((item) => ({ ...item, tipoCatalogo: 'caderno' }))
  ];
  preencherSelectAlbunsReaudicao();
  renderizarGraficoReaudicoes();
}

async function buscarAlbumDuplicado(banda, album, ignorar = null, tipoCadastro = 'album') {
  const chave = criarChaveAlbum(banda, album);
  if (!normalizarTexto(banda) || !normalizarTexto(album)) return null;
  const snapshots = await Promise.all([
    getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid))),
    getDocs(query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid)))
  ]);
  const documentos = snapshots.flatMap((snapshot, indice) => snapshot.docs.map((item) => ({
    id: item.id,
    colecao: indice === 0 ? 'albuns' : 'historico_reaudicoes',
    data: item.data()
  })));
  try {
    const legado = await getDocs(query(collection(db, 'reaudicoes'), where('userId', '==', usuarioAtual.uid)));
    documentos.push(...legado.docs.map((item) => ({ id: item.id, colecao: 'reaudicoes', data: item.data() })));
  } catch (erro) {
    console.info('Consulta da coleção legada ignorada durante validação de duplicidade.');
  }

  return documentos.find((item) => {
    if (ignorar && item.colecao === (ignorar.colecaoDados || 'historico_reaudicoes') && item.id === (ignorar.firestoreId || ignorar.id)) return false;
    const dados = item.data;
    if (item.colecao !== 'albuns' && tipoCadastro === 'caderno' && dados.integradoAlbumPrincipal && !registroVeioDoCaderno(dados)) return false;
    const chaveExistente = criarChaveAlbum(
      dados.bandaCaderno || dados.nomeBanda || dados.banda || dados.artista,
      dados.nomeCaderno || dados.nomeAlbum || dados.album || dados.nome || dados.titulo
    );
    return chaveExistente === chave;
  }) || null;
}

async function abrirModalNovoAlbumInteligente() {
  try {
    await carregarAlbunsParaReaudicao();
  } catch (erro) {
    console.error('Erro ao carregar catálogo de álbuns:', erro);
    mostrarToast('Não foi possível carregar o catálogo de álbuns.', 'erro');
    return;
  }
  const select = document.getElementById('novo-album-fonte');
  select.innerHTML = '<option value="">Selecione um álbum</option>' + reaudicaoCatalogo.map((item) => {
    const titulo = item.nomeCaderno || item.nome || 'Álbum sem nome';
    const banda = item.bandaCaderno || item.banda || 'Artista não informado';
    const origem = item.tipoCatalogo === 'caderno' ? `Caderno · ${Number(item.notaAntiga || 0).toFixed(1)}` : 'Álbuns';
    return `<option value="${escaparHtml(item.tipoCatalogo)}:${escaparHtml(item.id)}">${escaparHtml(banda)} — ${escaparHtml(titulo)} (${origem})</option>`;
  }).join('');
  document.querySelector('input[name="modo-escuta"][value="inedita"]').checked = true;
  document.getElementById('grupo-selecao-reaudicao').classList.add('escondido');
  select.required = false;
  document.getElementById('novo-album-fonte-resumo').textContent = '';
  document.getElementById('modal-novo-album-inteligente').classList.remove('escondido');
}

function iniciarAvaliacaoCompleta(fonteSelecionada) {
  const albumOriginal = fonteSelecionada?.tipoCatalogo === 'album'
    ? fonteSelecionada
    : fonteSelecionada ? {
      ...fonteSelecionada,
      nome: fonteSelecionada.nomeCaderno || fonteSelecionada.nome,
      banda: fonteSelecionada.bandaCaderno || fonteSelecionada.banda,
      imagem: fonteSelecionada.imagemCaderno || fonteSelecionada.imagem,
      ano: fonteSelecionada.anoCaderno || fonteSelecionada.ano,
      media: Number(fonteSelecionada.notaAntiga ?? fonteSelecionada.notaOriginal ?? fonteSelecionada.media ?? 0),
      criadoEm: fonteSelecionada.dataOriginal || fonteSelecionada.dataReouvido || fonteSelecionada.criadoEm
    } : null;
  prepararNovoAlbum();
  reaudicaoModoAtivo = true;
  reaudicaoAlbumOriginal = albumOriginal;
  if (fonteSelecionada?.tipoCatalogo === 'album') {
    selecionarTimerAudicao(`album:${fonteSelecionada.id}`, 0);
  } else if (fonteSelecionada?.tipoCatalogo === 'caderno') {
    selecionarTimerAudicao(`album:caderno:${fonteSelecionada.colecaoDados || 'historico_reaudicoes'}:${fonteSelecionada.firestoreId || fonteSelecionada.id}`, 0);
  } else {
    selecionarTimerAudicao(obterIdRascunhoTimer(), 0);
  }
  if (albumOriginal) {
    document.getElementById('album-nome').value = albumOriginal.nome || '';
    document.getElementById('album-banda').value = albumOriginal.banda || '';
    document.getElementById('album-ano').value = albumOriginal.ano || '';
    document.getElementById('album-favorita').value = albumOriginal.favorita || '';
    if (String(albumOriginal.imagem || '').startsWith('data:image/')) {
      imagemBase64Temp = albumOriginal.imagem;
      document.getElementById('album-imagem').value = '';
    } else {
      document.getElementById('album-imagem').value = albumOriginal.imagem || '';
    }
    document.getElementById('album-obs').value = '';
    document.getElementById('preview-container').classList.toggle('escondido', !albumOriginal.imagem);
    document.getElementById('img-preview').src = albumOriginal.imagem || '';
    containerFaixas.innerHTML = '';
    if (Array.isArray(albumOriginal.faixas) && albumOriginal.faixas.length) {
      albumOriginal.faixas.forEach((faixa) => addLinhaFaixa(faixa.nome || '', 'Boa'));
    } else addLinhaFaixa();
  }
  document.getElementById('form-titulo').textContent = albumOriginal
    ? `Ré-audição: ${albumOriginal.nome || 'Álbum'}`
    : 'Nova audição (cadastro manual)';
  document.getElementById('btn-salvar').textContent = 'Salvar no Histórico';
  navegarPara('sec-novo-album');
}

document.querySelectorAll('input[name="modo-escuta"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const reaudicao = document.querySelector('input[name="modo-escuta"]:checked')?.value === 'reaudicao';
    document.getElementById('grupo-selecao-reaudicao').classList.toggle('escondido', !reaudicao);
    document.getElementById('novo-album-fonte').required = reaudicao;
  });
});

document.getElementById('novo-album-fonte').addEventListener('change', (event) => {
  const fonte = obterFonteReaudicao(event.target.value);
  const resumo = document.getElementById('novo-album-fonte-resumo');
  if (!fonte) {
    resumo.textContent = '';
    return;
  }
  const nome = fonte.nomeCaderno || fonte.nome || 'Álbum sem nome';
  const banda = fonte.bandaCaderno || fonte.banda || 'Artista não informado';
  const nota = fonte.notaAntiga ?? fonte.media;
  resumo.textContent = `${banda} · ${nome}${nota !== undefined ? ` · Nota anterior ${Number(nota).toFixed(1)}` : ''}`;
});

document.getElementById('form-novo-album-inteligente').addEventListener('submit', (event) => {
  event.preventDefault();
  const modo = document.querySelector('input[name="modo-escuta"]:checked')?.value;
  if (modo === 'reaudicao') {
    const fonte = obterFonteReaudicao(document.getElementById('novo-album-fonte').value);
    if (!fonte) return mostrarToast('Selecione um álbum para reouvir.', 'erro');
    const cadernoJaIntegrado = fonte.tipoCatalogo === 'caderno' && fonte.integradoAlbumPrincipal;
    if (cadernoJaIntegrado) return mostrarToast('Este registro do Caderno já foi reouvido. Use Editar no card para ajustar a avaliação.', 'erro');
    const reaudicaoAnterior = reaudicoesLista.find((item) => fonte.tipoCatalogo === 'album'
      ? item.albumIdOriginal === fonte.id && item.integradoAlbumPrincipal
      : item.id === fonte.id && item.integradoAlbumPrincipal);
    if (reaudicaoAnterior && !confirm('Já existe uma ré-audição para este álbum. Registrar outra avaliação mesmo assim?')) return;
    document.getElementById('modal-novo-album-inteligente').classList.add('escondido');
    iniciarAvaliacaoCompleta(fonte);
    return;
  }
  document.getElementById('modal-novo-album-inteligente').classList.add('escondido');
  prepararNovoAlbum();
  navegarPara('sec-novo-album');
});

function atualizarMetricasReaudicao() {
  const completas = reaudicoesLista.filter((item) => !item.registroRapido || item.integradoAlbumPrincipal);
  const vinculadas = completas.filter(temNotaOriginal);
  const mediaNova = completas.length
    ? completas.reduce((soma, item) => soma + Number(item.nota || 0), 0) / completas.length
    : 0;
  const mediaOriginal = vinculadas.length
    ? vinculadas.reduce((soma, item) => soma + Number(item.notaOriginal), 0) / vinculadas.length
    : 0;
  const variacoes = vinculadas.map((item) => ({ ...item, variacao: Number(item.nota || 0) - Number(item.notaOriginal) }));
  const maiorGanho = [...variacoes].sort((a, b) => b.variacao - a.variacao)[0];
  const maiorQueda = [...variacoes].sort((a, b) => a.variacao - b.variacao)[0];

  document.getElementById('reaudicao-total').textContent = String(completas.length);
  document.getElementById('reaudicao-medias').textContent = `${mediaNova.toFixed(1)} / ${vinculadas.length ? mediaOriginal.toFixed(1) : '—'}`;
  document.getElementById('reaudicao-maior-ganho').textContent = maiorGanho && maiorGanho.variacao > 0
    ? `${maiorGanho.album} (+${maiorGanho.variacao.toFixed(1)})`
    : 'Ainda sem ganho';
  document.getElementById('reaudicao-maior-queda').textContent = maiorQueda && maiorQueda.variacao < 0
    ? `${maiorQueda.album} (${maiorQueda.variacao.toFixed(1)})`
    : 'Ainda sem queda';
}

function renderizarReaudicoes() {
  const container = document.getElementById('lista-reaudicoes');
  if (!container) return;
  atualizarMetricasReaudicao();
  renderizarGraficoReaudicoes();
  renderizarBarrasComparacaoReaudicoes();
  const notasComparacao = reaudicoesLista.flatMap((item) => {
    const antigas = Number.parseFloat(item.notaAntiga ?? item.notaOriginal ?? item.notaCaderno ?? item.mediaAntiga);
    const atuais = Number.parseFloat(item.notaAtual ?? item.media ?? item.nota);
    return [antigas, ...((!item.registroRapido || item.integradoAlbumPrincipal) ? [atuais] : [])].filter(Number.isFinite);
  });
  const menorNotaComparacao = notasComparacao.length ? Math.min(...notasComparacao) : 0;
  const maiorNotaComparacao = notasComparacao.length ? Math.max(...notasComparacao) : 10;
  if (!reaudicoesLista.length) {
    container.innerHTML = '<p class="empty-state">Nenhuma ré-audição registrada.</p>';
    atualizarOpcoesComparador();
    return;
  }

  container.innerHTML = reaudicoesLista.map((item) => {
    const registroRapido = Boolean(item.registroRapido && !item.integradoAlbumPrincipal);
    const vinculada = temNotaOriginal(item);
    const notaAntiga = Number(item.notaAntiga ?? item.notaOriginal ?? item.nota ?? 0);
    const variacao = Number(item.nota || 0) - notaAntiga;
    const estado = variacao > 0 ? 'subiu' : variacao < 0 ? 'caiu' : 'igual';
    const tempo = vinculada && item.dataOriginal && !registroRapido
      ? `Reouvido após ${calcularIntervaloAudicoes(item.dataOriginal, item.dataReouvido)}`
      : '';
    const capa = item.capa || '';
    const imagemCard = capa ? `<img class="reaudicao-par-capa" src="${escaparHtml(capa)}" alt="Capa de ${escaparHtml(item.album)}" loading="lazy">` : '';
    const temOriginal = registroRapido || vinculada;
    const acoesOriginal = item.origem === 'caderno_antigo'
      ? `<div class="reaudicao-card-acoes"><button type="button" class="btn-alerta" data-caderno-editar="${escaparHtml(item.id)}">Editar</button><button type="button" class="btn-perigo" data-caderno-excluir="${escaparHtml(item.id)}">Excluir</button></div>`
      : item.albumIdOriginal
        ? `<div class="reaudicao-card-acoes"><button type="button" class="btn-alerta" data-original-editar="${escaparHtml(item.albumIdOriginal)}">Editar</button><button type="button" class="btn-perigo" data-original-excluir="${escaparHtml(item.albumIdOriginal)}">Excluir</button></div>`
        : '';
    const esquerda = temOriginal ? `
      <article class="reaudicao-par-card caderno-card nota-gradiente" style="--nota-cor: ${calcularCorPorNota(notaAntiga, menorNotaComparacao, maiorNotaComparacao)}">
        <span class="reaudicao-par-tipo">${item.origem === 'caderno_antigo' ? 'Caderno Antigo' : 'Audição Original'}</span>
        ${(item.imagemCaderno || capa) ? `<img class="reaudicao-par-capa" src="${escaparHtml(item.imagemCaderno || capa)}" alt="Capa de ${escaparHtml(item.nomeCaderno || item.album)}" loading="lazy">` : ''}
        <h3>${escaparHtml(item.nomeCaderno || item.album || 'Álbum sem nome')}</h3>
        <p class="album-artist">${escaparHtml(item.bandaCaderno || item.banda || 'Artista não informado')}</p>
        <span class="reaudicao-par-tipo">${item.origem === 'caderno_antigo' ? 'Nota original do caderno' : 'Nota original'}</span>
        <strong class="reaudicao-par-nota">${notaAntiga.toFixed(1)}</strong>
        <time>1ª escuta: ${formatarDataReaudicao(item.dataOriginal || item.criadoEm)}</time>
        ${acoesOriginal}
      </article>` : '';
    const direita = registroRapido
      ? `<article class="reaudicao-par-card reaudicao-pendente"><span class="reaudicao-par-tipo">Ré-audição</span><h3>Aguardando nova avaliação</h3><p>Selecione este álbum em “Registrar Ré-audição” para preencher a avaliação completa.</p></article>`
      : `<article class="reaudicao-par-card reaudicao-atual nota-gradiente ${estado}" style="--nota-cor: ${calcularCorPorNota(item.nota, menorNotaComparacao, maiorNotaComparacao)}">
          <div class="reaudicao-atual-topo"><span class="reaudicao-par-tipo">Ré-audição</span><span class="reaudicao-delta-badge ${estado}">${variacao > 0 ? 'Subiu 📈' : variacao < 0 ? 'Caiu 📉' : 'Nota igual ='}</span></div>
          ${imagemCard}
          <h3>${escaparHtml(item.album || 'Álbum sem nome')}</h3>
          <p class="album-artist">${escaparHtml(item.banda || 'Artista não informado')}</p>
          <strong class="reaudicao-par-nota">${Number(item.nota || 0).toFixed(1)}</strong>
          <time>Ré-audição: ${formatarDataReaudicao(item.dataReouvido)}</time>
          ${tempo ? `<span class="reaudicao-badge">${tempo}</span>` : ''}
          <p class="reaudicao-par-comparativo">Nota antiga: ${notaAntiga.toFixed(1)} → Nova nota: ${Number(item.nota || 0).toFixed(1)} (${variacao > 0 ? '+' : ''}${variacao.toFixed(1)})</p>
          ${item.observacoes ? `<p class="reaudicao-observacao">${escaparHtml(item.observacoes)}</p>` : ''}
              <div class="reaudicao-card-acoes"><button type="button" class="btn-alerta" data-reaudicao-editar="${escaparHtml(item.id)}">Editar</button><button type="button" class="btn-perigo reaudicao-excluir" data-reaudicao-excluir="${escaparHtml(item.id)}" aria-label="Excluir ré-audição de ${escaparHtml(item.album)}">Excluir</button></div>
        </article>`;
            return `<section class="reaudicao-par ${!temOriginal ? 'avulsa' : registroRapido ? 'aguardando' : estado}">${esquerda}${direita}</section>`;
  }).join('');
  atualizarOpcoesComparador();
}

function renderizarGraficoReaudicoes() {
  const canvas = document.getElementById('grafico-evolucao-reaudicoes');
  const seletor = document.getElementById('reaudicao-filtro-banda');
  if (!canvas || !seletor || typeof Chart === 'undefined') return;
  const bandas = [...new Set([
    ...reaudicaoAlbunsBase.map((item) => item.banda),
    ...reaudicoesLista.map((item) => item.banda)
  ].map((banda) => String(banda || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const bandaAtual = seletor.value;
  seletor.innerHTML = '<option value="">Selecione uma banda</option>' + bandas
    .map((banda) => `<option value="${escaparHtml(banda)}">${escaparHtml(banda)}</option>`).join('');
  if (bandas.includes(bandaAtual)) seletor.value = bandaAtual;
  if (!seletor.dataset.bound) {
    seletor.addEventListener('change', renderizarGraficoReaudicoes);
    seletor.dataset.bound = 'true';
  }

  if (reaudicaoEvolucaoChart) reaudicaoEvolucaoChart.destroy();
  const artista = seletor.value;
  if (!artista) return;
  const pontosOriginais = reaudicaoAlbunsBase
    .filter((item) => String(item.banda || '').trim() === artista)
    .map((item) => ({ x: converterDataReaudicao(item.criadoEm)?.getTime(), y: Number(item.media), album: item.nome, tipo: 'Audição original' }))
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));
  const pontosReaudicao = reaudicoesLista
    .filter((item) => String(item.banda || '').trim() === artista)
    .flatMap((item) => {
      const pontos = [];
      if (item.origem === 'caderno_antigo' && temNotaOriginal(item) && item.dataOriginal) {
        pontos.push({ x: converterDataReaudicao(item.dataOriginal)?.getTime(), y: Number(item.notaOriginal), album: item.album, tipo: 'Caderno antigo' });
      }
      if (item.registroRapido && !item.integradoAlbumPrincipal) return pontos;
      pontos.push({ x: converterDataReaudicao(item.dataReouvido)?.getTime(), y: Number(item.nota), album: item.album, tipo: 'Ré-audição' });
      return pontos;
    })
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));
  const pontos = [...pontosOriginais, ...pontosReaudicao].sort((a, b) => a.x - b.x);
  reaudicaoEvolucaoChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { datasets: [{
      label: `Nota · ${artista}`,
      data: pontos,
      parsing: false,
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.16)',
      pointBackgroundColor: pontos.map((ponto) => ponto.tipo === 'Ré-audição' ? '#fbbf24' : '#60a5fa'),
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2,
      tension: 0.25,
      fill: false
    }] },
    options: {
      responsive: true,
      devicePixelRatio: window.devicePixelRatio || 1,
      maintainAspectRatio: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { labels: { color: '#e5e7eb' } },
        tooltip: { callbacks: {
          title: (items) => {
            const data = items[0]?.raw;
            return data ? `${data.album} · ${data.tipo}` : '';
          },
          label: (item) => `Nota: ${Number(item.raw.y).toFixed(1)}`
        } }
      },
      scales: {
        x: {
          type: 'linear',
          ticks: { color: '#cbd5e1', maxTicksLimit: 8, callback: (valor) => new Intl.DateTimeFormat('pt-BR').format(new Date(Number(valor))) },
          grid: { color: 'rgba(255,255,255,0.08)' },
          title: { display: true, text: 'Data da audição', color: '#e5e7eb' }
        },
        y: {
          min: 0, max: 10,
          ticks: { color: '#cbd5e1', stepSize: 2 },
          grid: { color: 'rgba(255,255,255,0.08)' },
          title: { display: true, text: 'Nota média', color: '#e5e7eb' }
        }
      }
    }
  });
}

function renderizarBarrasComparacaoReaudicoes() {
  const canvas = document.getElementById('grafico-barras-reaudicoes');
  if (!canvas || typeof Chart === 'undefined') return;
  if (reaudicaoComparacaoChart) {
    reaudicaoComparacaoChart.destroy();
    reaudicaoComparacaoChart = null;
  }
  const comparacoes = reaudicoesLista.flatMap((item) => {
    if ((item.registroRapido && !item.integradoAlbumPrincipal) || !temNotaOriginal(item)) return [];
    const notaAntiga = Number.parseFloat(item.notaAntiga ?? item.notaOriginal ?? item.notaCaderno ?? item.mediaAntiga);
    const notaAtual = Number.parseFloat(item.notaAtual ?? item.media ?? item.nota);
    if (!Number.isFinite(notaAntiga) || !Number.isFinite(notaAtual) || notaAntiga < 0 || notaAntiga > 10 || notaAtual < 0 || notaAtual > 10) return [];
    return [{
      notaAntiga,
      notaAtual,
      album: String(item.nomeAlbum || item.album || item.nome || 'Álbum sem nome'),
      banda: String(item.nomeBanda || item.banda || 'Artista não informado')
    }];
  });
  reaudicaoComparacaoChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: comparacoes.map((item) => item.album),
      datasets: [{
        label: 'Nota Antiga - Caderno',
        data: comparacoes.map((item) => item.notaAntiga),
        backgroundColor: 'rgba(127, 140, 141, 0.78)',
        borderColor: '#7f8c8d',
        borderWidth: 1,
        borderRadius: 4
      }, {
        label: 'Nota Atual - Ré-audição',
        data: comparacoes.map((item) => item.notaAtual),
        backgroundColor: comparacoes.map((item) => `${calcularCorPorNota(item.notaAtual)}d9`),
        borderColor: comparacoes.map((item) => calcularCorPorNota(item.notaAtual)),
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      devicePixelRatio: window.devicePixelRatio || 1,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#e5e7eb' } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const item = comparacoes[context.dataIndex];
              return `${item.banda} - ${item.album} | Caderno: ${item.notaAntiga.toFixed(1)} ➔ Ré-audição: ${item.notaAtual.toFixed(1)}`;
            }
          }
        }
      },
      scales: {
        x: { stacked: false, ticks: { color: '#cbd5e1', autoSkip: true, maxRotation: 35, minRotation: 0 }, grid: { display: false }, title: { display: true, text: 'Álbuns reouvidos', color: '#e5e7eb' } },
        y: { min: 0, max: 10, ticks: { color: '#cbd5e1', stepSize: 2 }, grid: { color: 'rgba(255,255,255,0.08)' }, title: { display: true, text: 'Nota (0 a 10)', color: '#e5e7eb' } }
      }
    }
  });
}

function obterPontosComparacao(valor) {
  const [tipo, id] = valor.split(':');
  const item = reaudicoesLista.find((registro) => registro.id === id);
  if (!item) return null;
  if (tipo === 'original') {
    return {
      titulo: `${item.album} · Original`, banda: item.banda, nota: Number(item.notaOriginal),
      data: item.dataOriginal, observacoes: item.observacoesOriginal || '', tipo: 'Original'
    };
  }
  return {
    titulo: `${item.album} · Ré-audição`, banda: item.banda, nota: Number(item.nota || 0),
    data: item.dataReouvido, observacoes: item.observacoes || '', tipo: 'Ré-audição'
  };
}

function atualizarOpcoesComparador() {
  const primeiro = document.getElementById('comparar-reaudicao-a');
  const segundo = document.getElementById('comparar-reaudicao-b');
  if (!primeiro || !segundo) return;
  const options = [];
  reaudicoesLista.forEach((item) => {
    if (temNotaOriginal(item)) {
      options.push(`<option value="original:${escaparHtml(item.id)}">${escaparHtml(item.album)} · Original (${Number(item.notaOriginal).toFixed(1)})</option>`);
    }
    if (item.registroRapido && !item.integradoAlbumPrincipal) return;
    options.push(`<option value="reaudicao:${escaparHtml(item.id)}">${escaparHtml(item.album)} · ${formatarDataReaudicao(item.dataReouvido)} (${Number(item.nota || 0).toFixed(1)})</option>`);
  });
  const anteriorA = primeiro.value;
  const anteriorB = segundo.value;
  const markup = options.length ? options.join('') : '<option value="">Nenhuma audição disponível</option>';
  primeiro.innerHTML = markup;
  segundo.innerHTML = markup;
  if ([...primeiro.options].some((option) => option.value === anteriorA)) primeiro.value = anteriorA;
  if ([...segundo.options].some((option) => option.value === anteriorB)) segundo.value = anteriorB;
  if (primeiro.options.length > 1 && primeiro.value === segundo.value) segundo.selectedIndex = 1;
  renderizarComparacao();
}

function renderizarComparacao() {
  const resultado = document.getElementById('comparador-resultado');
  const a = obterPontosComparacao(document.getElementById('comparar-reaudicao-a')?.value || '');
  const b = obterPontosComparacao(document.getElementById('comparar-reaudicao-b')?.value || '');
  if (!resultado) return;
  if (!a || !b) {
    resultado.innerHTML = '<p class="empty-state">Registre ao menos uma ré-audição vinculada a um álbum para comparar.</p>';
    return;
  }
  const diferenca = b.nota - a.nota;
  const intervalo = a.data && b.data ? calcularIntervaloAudicoes(a.data, b.data) : 'Data indisponível';
  resultado.innerHTML = `
    <div class="comparador-cards">
      ${[a, b].map((item) => `<article class="comparador-card"><span class="comparador-tipo">${item.tipo}</span><h4>${escaparHtml(item.titulo)}</h4><p>${escaparHtml(item.banda || '')}</p><strong class="comparador-nota">${item.nota.toFixed(1)}</strong><time>${formatarDataReaudicao(item.data)}</time><p class="comparador-observacao">${escaparHtml(item.observacoes || 'Sem observações.')}</p></article>`).join('')}
    </div>
    <p class="comparador-resumo">Variação: <strong class="${diferenca > 0 ? 'ganho' : diferenca < 0 ? 'queda' : 'estavel'}">${diferenca > 0 ? '+' : ''}${diferenca.toFixed(1)}</strong><span>Intervalo entre as audições: ${intervalo}</span></p>`;
}

function subscribeReaudicoes() {
  if (!usuarioAtual) return;
  carregarAlbunsParaReaudicao().catch((erro) => {
    console.error('Erro ao carregar álbuns para ré-audição:', erro);
  });
  const consulta = query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid));
  if (reaudicoesUnsubscribe) reaudicoesUnsubscribe();
  reaudicoesUnsubscribe = onSnapshot(consulta, (snapshot) => {
    const atuais = snapshot.docs.map((item) => normalizarDocumentoReaudicao(item.id, item.data()));
    const chavesAtuais = new Set(atuais.map((item) => `${item.colecaoDados}:${item.firestoreId}`));
    reaudicoesLista = [...atuais, ...reaudicoesLegadas.filter((item) => !chavesAtuais.has(`${item.colecaoDados}:${item.firestoreId}`))]
      .sort((a, b) => (converterDataReaudicao(b.dataReouvido)?.getTime() || 0) - (converterDataReaudicao(a.dataReouvido)?.getTime() || 0));
    renderizarReaudicoes();
    const telaDashboard = document.getElementById('sec-dashboard');
    if (telaDashboard && !telaDashboard.classList.contains('escondido')) carregarAlbuns();
  }, (erro) => {
    console.error('Erro ao acompanhar ré-audições:', erro);
    document.getElementById('lista-reaudicoes').innerHTML = '<p class="empty-state">Não foi possível carregar as ré-audições.</p>';
  });
}

async function abrirModalReaudicao() {
  try {
    await carregarAlbunsParaReaudicao();
  } catch (erro) {
    console.error('Erro ao atualizar seleção de álbuns:', erro);
  }
  document.getElementById('form-reaudicao').reset();
  document.getElementById('form-caderno-antigo').reset();
  document.getElementById('form-caderno-antigo').classList.add('escondido');
  document.getElementById('form-reaudicao').classList.remove('escondido');
  preencherSelectAlbunsReaudicao();
  document.getElementById('modal-reaudicao').classList.remove('escondido');
  document.getElementById('reaudicao-album-existente').focus();
}

document.getElementById('btn-nova-reaudicao').addEventListener('click', abrirModalReaudicao);
document.getElementById('btn-mostrar-caderno-antigo').addEventListener('click', () => {
  document.getElementById('form-reaudicao').classList.add('escondido');
  document.getElementById('form-caderno-antigo').classList.remove('escondido');
  document.getElementById('caderno-banda').focus();
});
document.getElementById('btn-voltar-selecao-caderno').addEventListener('click', () => {
  document.getElementById('form-caderno-antigo').classList.add('escondido');
  document.getElementById('form-reaudicao').classList.remove('escondido');
});
function abrirEdicaoCaderno(id) {
  const item = reaudicoesLista.find((registro) => registro.id === id);
  if (!item) return;
  document.getElementById('form-reaudicao').classList.add('escondido');
  document.getElementById('form-caderno-antigo').classList.remove('escondido');
  document.getElementById('caderno-id').value = id;
  document.getElementById('caderno-banda').value = item.bandaCaderno || item.banda || '';
  document.getElementById('caderno-album').value = item.nomeCaderno || item.album || '';
  document.getElementById('caderno-nota').value = item.notaAntiga ?? item.notaOriginal ?? item.nota ?? '';
  document.getElementById('caderno-ano').value = item.anoCaderno || item.ano || '';
  document.getElementById('caderno-capa').value = String(item.imagemCaderno || item.capa || '').startsWith('data:') ? '' : item.imagemCaderno || item.capa || '';
  document.getElementById('caderno-data-escuta').value = (converterDataReaudicao(item.dataOriginal || item.criadoEm) || new Date()).toISOString().slice(0, 10);
  document.getElementById('modal-reaudicao').classList.remove('escondido');
  document.getElementById('caderno-banda').focus();
}

function abrirEdicaoReaudicao(id) {
  const item = reaudicoesLista.find((registro) => registro.id === id);
  if (!item) return;
  prepararNovoAlbum();
  reaudicaoModoAtivo = true;
  reaudicaoEditandoId = id;
  reaudicaoAlbumOriginal = null;
  document.getElementById('album-nome').value = item.album || item.nome || '';
  document.getElementById('album-banda').value = item.banda || '';
  document.getElementById('album-ano').value = item.ano || '';
  document.getElementById('album-favorita').value = item.favorita || '';
  document.getElementById('album-obs').value = item.observacoes || item.obs || '';
  document.getElementById('album-duracao').value = item.duracao || '';
  definirTimerAudicao(item.duracaoSegundos || 0, obterSufixoTimerReaudicao(item));
  if (String(item.capa || '').startsWith('data:image/')) {
    imagemBase64Temp = item.capa;
    document.getElementById('album-imagem').value = '';
    document.getElementById('img-preview').src = item.capa;
    document.getElementById('preview-container').classList.remove('escondido');
  } else {
    document.getElementById('album-imagem').value = item.capa || '';
  }
  containerFaixas.innerHTML = '';
  (item.faixas || []).forEach((faixa) => addLinhaFaixa(faixa.nome || '', faixa.classificacao || 'Boa'));
  if (!item.faixas?.length) addLinhaFaixa();
  document.getElementById('form-titulo').textContent = `Editar ré-audição: ${item.album || item.nome || 'Álbum'}`;
  document.getElementById('btn-salvar').textContent = 'Atualizar Ré-audição';
  navegarPara('sec-novo-album');
}

document.getElementById('form-caderno-antigo').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validarUsuarioParaSalvar()) return;
  try {
    const id = document.getElementById('caderno-id').value;
    const itemAnterior = id ? reaudicoesLista.find((registro) => registro.id === id) : null;
    const bandaCaderno = document.getElementById('caderno-banda').value.trim();
    const nomeCaderno = document.getElementById('caderno-album').value.trim();
    const duplicado = await buscarAlbumDuplicado(bandaCaderno, nomeCaderno, itemAnterior, 'caderno');
    if (duplicado) {
      mostrarToast('Este álbum já existe no seu catálogo. Use o fluxo de ré-audição.', 'erro');
      return;
    }
    const arquivo = document.getElementById('caderno-capa-arquivo');
    const imagem = await lerCapaCadernoCompactada(arquivo);
    const notaAntiga = Number(document.getElementById('caderno-nota').value);
    const dataEscutaInput = document.getElementById('caderno-data-escuta').value;
    const dataEscuta = dataEscutaInput
      ? new Date(`${dataEscutaInput}T12:00:00`).toISOString()
      : new Date().toISOString();
    const editandoCaderno = Boolean(id);
    const imagemFinal = imagem || document.getElementById('caderno-capa').value.trim() || itemAnterior?.imagemCaderno || itemAnterior?.capa || '';
    const dados = {
      origem: 'caderno_antigo',
      userId: usuarioAtual.uid,
      bandaCaderno: document.getElementById('caderno-banda').value.trim(),
      nomeCaderno: document.getElementById('caderno-album').value.trim(),
      imagemCaderno: imagemFinal,
      anoCaderno: Number(document.getElementById('caderno-ano').value) || null,
      notaAntiga,
      ...(itemAnterior?.integradoAlbumPrincipal ? { notaOriginal: notaAntiga } : { notaOriginal: notaAntiga, banda: document.getElementById('caderno-banda').value.trim(), nome: document.getElementById('caderno-album').value.trim(), imagem: imagemFinal, ano: Number(document.getElementById('caderno-ano').value) || null, dataReouvido: dataEscuta }),
      dataOriginal: dataEscuta,
      atualizadoEm: serverTimestamp()
    };
    if (id) {
      await updateDoc(itemAnterior ? obterRefReaudicao(itemAnterior) : doc(db, 'historico_reaudicoes', id), dados);
    } else {
      await addDoc(collection(db, 'historico_reaudicoes'), {
        ...dados,
        banda: dados.bandaCaderno,
        nome: dados.nomeCaderno,
        imagem: imagemFinal,
        ano: dados.anoCaderno,
        dataReouvido: dataEscuta,
        criadoEm: serverTimestamp(),
        integradoAlbumPrincipal: false,
        registroRapido: true
      });
    }
    document.getElementById('form-caderno-antigo').reset();
    document.getElementById('form-caderno-antigo').classList.add('escondido');
    document.getElementById('form-reaudicao').classList.remove('escondido');
    if (editandoCaderno) document.getElementById('modal-reaudicao').classList.add('escondido');
    mostrarToast(editandoCaderno ? 'Caderno Antigo atualizado.' : 'Registro salvo no Caderno Antigo.');
    carregarAlbunsParaReaudicao().catch((erro) => console.error('Falha ao atualizar catálogo após salvar Caderno:', erro));
  } catch (erro) {
    console.error('Erro ao salvar no Caderno Antigo:', erro);
    const mensagem = erro?.code === 'permission-denied'
      ? 'O Firestore negou a gravação. Confira as regras publicadas para historico_reaudicoes.'
      : erro?.code === 'resource-exhausted'
        ? 'A imagem ainda excede o limite aceito pelo Firestore.'
        : 'Não foi possível salvar no Caderno Antigo.';
    mostrarToast(mensagem, 'erro');
  }
});

document.getElementById('form-reaudicao').addEventListener('submit', (event) => {
  event.preventDefault();
  const fonteSelecionada = obterFonteReaudicao(document.getElementById('reaudicao-album-existente').value);
  document.getElementById('modal-reaudicao').classList.add('escondido');
  iniciarAvaliacaoCompleta(fonteSelecionada);
});

document.getElementById('lista-reaudicoes').addEventListener('click', async (event) => {
  const editarCaderno = event.target.closest('[data-caderno-editar]');
  const excluirCaderno = event.target.closest('[data-caderno-excluir]');
  const editarReaudicao = event.target.closest('[data-reaudicao-editar]');
  const excluirReaudicao = event.target.closest('[data-reaudicao-excluir]');
  const editarOriginal = event.target.closest('[data-original-editar]');
  const excluirOriginal = event.target.closest('[data-original-excluir]');

  if (editarCaderno) return abrirEdicaoCaderno(editarCaderno.dataset.cadernoEditar);
  if (editarReaudicao) return abrirEdicaoReaudicao(editarReaudicao.dataset.reaudicaoEditar);
  if (editarOriginal) return window.editarAlbum(editarOriginal.dataset.originalEditar);

  try {
    if (excluirCaderno) {
      const item = reaudicoesLista.find((registro) => registro.id === excluirCaderno.dataset.cadernoExcluir);
      if (!item) return;
      if (item.integradoAlbumPrincipal) {
        const manterReaudicao = confirm('Excluir o Caderno Antigo e manter a Ré-audição como escuta avulsa, removendo a comparação?');
        if (!manterReaudicao) return;
        await updateDoc(obterRefReaudicao(item), {
          origem: 'avaliacao_manual',
          nomeCaderno: null,
          bandaCaderno: null,
          imagemCaderno: null,
          anoCaderno: null,
          notaOriginal: null,
          notaAntiga: null,
          dataOriginal: null,
          albumIdOriginal: null,
          registroRapido: false,
          integradoAlbumPrincipal: true,
          atualizadoEm: serverTimestamp()
        });
      } else {
        if (!confirm('Excluir este registro do Caderno Antigo?')) return;
        await deleteDoc(obterRefReaudicao(item));
      }
      mostrarToast('Registro do Caderno atualizado.');
      return;
    }

    if (excluirReaudicao) {
      const item = reaudicoesLista.find((registro) => registro.id === excluirReaudicao.dataset.reaudicaoExcluir);
      if (!item || !confirm('Excluir somente esta Ré-audição?')) return;
      if (item.origem === 'caderno_antigo' && item.integradoAlbumPrincipal) {
        await updateDoc(obterRefReaudicao(item), {
          nome: item.nomeCaderno || item.album,
          banda: item.bandaCaderno || item.banda,
          imagem: item.imagemCaderno || item.capa || '',
          ano: item.anoCaderno || item.ano || null,
          media: null,
          somaNotas: null,
          nmp: null,
          faixas: [],
          obs: '',
          favorita: '',
          duracao: '',
          duracaoSegundos: 0,
          notaOriginal: item.notaAntiga,
          dataOriginal: item.dataOriginal,
          dataReouvido: item.dataOriginal,
          registroRapido: true,
          integradoAlbumPrincipal: false,
          atualizadoEm: serverTimestamp()
        });
      } else {
        await deleteDoc(obterRefReaudicao(item));
      }
      mostrarToast('Ré-audição removida; o registro original foi preservado.');
      return;
    }

    if (excluirOriginal) {
      const item = reaudicoesLista.find((registro) => registro.albumIdOriginal === excluirOriginal.dataset.originalExcluir);
      if (!item || !confirm('Excluir o álbum original de Meus Álbuns e manter a Ré-audição como escuta avulsa?')) return;
      await deleteDoc(doc(db, 'albuns', item.albumIdOriginal));
      await updateDoc(obterRefReaudicao(item), {
        origem: 'avaliacao_manual',
        notaOriginal: null,
        notaAntiga: null,
        dataOriginal: null,
        albumIdOriginal: null,
        integradoAlbumPrincipal: true,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Álbum original removido e comparação desvinculada.');
    }
  } catch (erro) {
    console.error('Erro ao atualizar registros de audição:', erro);
    mostrarToast('Não foi possível concluir a ação.', 'erro');
  }
});

document.getElementById('btn-comparar-reaudicoes').addEventListener('click', () => {
  atualizarOpcoesComparador();
  document.getElementById('modal-comparar-reaudicoes').classList.remove('escondido');
});
['comparar-reaudicao-a', 'comparar-reaudicao-b'].forEach((id) => {
  document.getElementById(id).addEventListener('change', renderizarComparacao);
});
document.querySelectorAll('[data-fechar-modal]').forEach((botao) => {
  botao.addEventListener('click', () => document.getElementById(botao.dataset.fecharModal)?.classList.add('escondido'));
});
['modal-reaudicao', 'modal-comparar-reaudicoes'].forEach((id) => {
  document.getElementById(id).addEventListener('click', (event) => {
    if (event.target.id === id) event.currentTarget.classList.add('escondido');
  });
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

function obterUsuarioTimerId() {
  return usuarioAtual?.uid || auth.currentUser?.uid || 'anonimo';
}

function obterChaveTimerStorage(timerId = timerAudicaoId) {
  return `musicbox:timer:${obterUsuarioTimerId()}:${timerId}`;
}

function obterChaveRascunhoTimer() {
  return `musicbox:timer-rascunho:${obterUsuarioTimerId()}`;
}

function obterSufixoTimerReaudicao(item) {
  if (item.albumIdOriginal) return `album:${item.albumIdOriginal}`;
  const colecao = item.colecaoDados || 'historico_reaudicoes';
  const id = item.firestoreId || item.id;
  return item.origem === 'caderno_antigo'
    ? `album:caderno:${colecao}:${id}`
    : `album:reaudicao:${colecao}:${id}`;
}

function obterIdRascunhoTimer() {
  try {
    let id = localStorage.getItem(obterChaveRascunhoTimer());
    if (!id) {
      id = `rascunho-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(obterChaveRascunhoTimer(), id);
    }
    return id;
  } catch (erro) {
    return `rascunho-${obterUsuarioTimerId()}`;
  }
}

function gravarTimerAudicao() {
  if (!timerAudicaoId) return;
  try {
    localStorage.setItem(obterChaveTimerStorage(), JSON.stringify({
      elapsedSeconds: timerAudicaoBaseSegundos,
      startedAt: timerAudicaoIniciadoEm
    }));
  } catch (erro) {
    console.warn('Não foi possível persistir o cronômetro localmente.', erro);
  }
}

function atualizarTempoDecorridoTimer() {
  timerAudicaoSegundos = timerAudicaoBaseSegundos + (timerAudicaoIniciadoEm
    ? Math.max(0, Math.floor((Date.now() - timerAudicaoIniciadoEm) / 1000))
    : 0);
  atualizarDisplayTimer();
}

function iniciarIntervaloTimer() {
  if (timerAudicaoIntervalo) return;
  timerAudicaoIntervalo = window.setInterval(atualizarTempoDecorridoTimer, 1000);
}

function selecionarTimerAudicao(timerId, fallbackSegundos = 0) {
  const proximoId = timerId || obterIdRascunhoTimer();
  if (timerAudicaoId === proximoId) {
    if (timerAudicaoIniciadoEm) iniciarIntervaloTimer();
    atualizarTempoDecorridoTimer();
    return;
  }
  if (timerAudicaoIntervalo) {
    atualizarTempoDecorridoTimer();
    timerAudicaoBaseSegundos = timerAudicaoSegundos;
    timerAudicaoIniciadoEm = null;
    window.clearInterval(timerAudicaoIntervalo);
    timerAudicaoIntervalo = null;
    gravarTimerAudicao();
  }

  timerAudicaoId = proximoId;
  timerAudicaoBaseSegundos = Math.max(0, Number(fallbackSegundos) || 0);
  timerAudicaoIniciadoEm = null;
  try {
    const salvo = JSON.parse(localStorage.getItem(obterChaveTimerStorage()) || 'null');
    if (salvo) {
      timerAudicaoBaseSegundos = Math.max(0, Number(salvo.elapsedSeconds) || 0);
      timerAudicaoIniciadoEm = Number(salvo.startedAt) || null;
    }
  } catch (erro) {
    console.warn('Estado salvo do cronômetro inválido; usando o tempo do álbum.', erro);
  }
  if (timerAudicaoId.startsWith('rascunho-')) {
    try { localStorage.setItem(obterChaveRascunhoTimer(), timerAudicaoId); } catch {}
  }
  if (timerAudicaoIniciadoEm) iniciarIntervaloTimer();
  atualizarTempoDecorridoTimer();
}

function migrarTimerAudicao(novoId) {
  atualizarTempoDecorridoTimer();
  const idAntigo = timerAudicaoId;
  const chaveAntiga = obterChaveTimerStorage();
  const estado = { elapsedSeconds: timerAudicaoSegundos, startedAt: timerAudicaoIniciadoEm };
  timerAudicaoId = novoId;
  timerAudicaoBaseSegundos = estado.elapsedSeconds;
  try {
    localStorage.setItem(obterChaveTimerStorage(), JSON.stringify(estado));
    if (chaveAntiga !== obterChaveTimerStorage()) localStorage.removeItem(chaveAntiga);
    if (String(idAntigo || '').startsWith('rascunho-') && localStorage.getItem(obterChaveRascunhoTimer()) === idAntigo) {
      localStorage.removeItem(obterChaveRascunhoTimer());
    }
  } catch (erro) {
    console.warn('Não foi possível associar o cronômetro ao ID salvo.', erro);
  }
}

function limparTimerRascunhoSalvo() {
  try {
    const rascunho = localStorage.getItem(obterChaveRascunhoTimer());
    if (rascunho) localStorage.removeItem(obterChaveTimerStorage(rascunho));
    localStorage.removeItem(obterChaveRascunhoTimer());
  } catch (erro) {
    console.warn('Não foi possível limpar o cronômetro do rascunho.', erro);
  }
}

function atualizarDisplayTimer() {
  const display = document.getElementById('audicao-tempo');
  const duracaoFormatada = formatarDuracao(timerAudicaoSegundos);
  if (display) display.textContent = duracaoFormatada;
  const campoDuracao = document.getElementById('album-duracao');
  if (campoDuracao && timerAudicaoSegundos > 0) campoDuracao.value = duracaoFormatada;
}

function iniciarTimerAudicao() {
  if (!timerAudicaoId) selecionarTimerAudicao(obterIdRascunhoTimer());
  if (!timerAudicaoIniciadoEm) {
    timerAudicaoBaseSegundos = timerAudicaoSegundos;
    timerAudicaoIniciadoEm = Date.now();
    gravarTimerAudicao();
  }
  iniciarIntervaloTimer();
  atualizarTempoDecorridoTimer();
}

function pausarTimerAudicao() {
  if (!timerAudicaoIniciadoEm && !timerAudicaoIntervalo) return;
  atualizarTempoDecorridoTimer();
  timerAudicaoBaseSegundos = timerAudicaoSegundos;
  timerAudicaoIniciadoEm = null;
  if (timerAudicaoIntervalo) window.clearInterval(timerAudicaoIntervalo);
  timerAudicaoIntervalo = null;
  gravarTimerAudicao();
}

function resetarTimerAudicao() {
  pausarTimerAudicao();
  timerAudicaoBaseSegundos = 0;
  timerAudicaoSegundos = 0;
  timerAudicaoIniciadoEm = null;
  if (timerAudicaoId) {
    try { localStorage.removeItem(obterChaveTimerStorage()); } catch {}
  }
  atualizarDisplayTimer();
  const campoDuracao = document.getElementById('album-duracao');
  if (campoDuracao) campoDuracao.value = '';
}

function definirTimerAudicao(segundos = 0, timerId = null) {
  const id = timerId
    ? (String(timerId).startsWith('album:') ? String(timerId) : `album:${timerId}`)
    : document.getElementById('album-id')?.value ? `album:${document.getElementById('album-id').value}` : obterIdRascunhoTimer();
  selecionarTimerAudicao(id, segundos);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && timerAudicaoIniciadoEm) atualizarTempoDecorridoTimer();
});
window.addEventListener('pageshow', () => {
  if (timerAudicaoIniciadoEm) atualizarTempoDecorridoTimer();
});
window.addEventListener('pagehide', gravarTimerAudicao);

document.getElementById('btn-timer-iniciar').addEventListener('click', iniciarTimerAudicao);
document.getElementById('btn-timer-pausar').addEventListener('click', pausarTimerAudicao);
document.getElementById('btn-timer-resetar').addEventListener('click', resetarTimerAudicao);
document.getElementById('btn-cancelar-album').addEventListener('click', () => {
  const telaRetorno = reaudicaoModoAtivo ? 'sec-reaudicoes' : 'sec-dashboard';
  prepararNovoAlbum();
  navegarPara(telaRetorno);
});

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
    if (!id && !reaudicaoModoAtivo) {
      const duplicado = await buscarAlbumDuplicado(banda, nome);
      if (duplicado) {
        mostrarToast('Este álbum já existe no seu catálogo. Se deseja ouvi-lo novamente, escolha Ré-audição.', 'erro');
        return;
      }
    }
    atualizarTempoDecorridoTimer();
    const ano = Number(document.getElementById('album-ano').value);
    const urlImagemInput = document.getElementById('album-imagem').value;
    const favorita = document.getElementById('album-favorita').value;
    const obs = document.getElementById('album-obs').value;
    const duracaoInformada = document.getElementById('album-duracao').value.trim();
    const duracao = timerAudicaoSegundos > 0 ? formatarDuracao(timerAudicaoSegundos) : duracaoInformada;
    const duracaoSegundos = timerAudicaoSegundos > 0
      ? timerAudicaoSegundos
      : converterDuracaoParaSegundos(duracaoInformada);

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
      btnSalvar.innerText = reaudicaoModoAtivo ? 'Salvar no Histórico' : 'Salvar Álbum';
      return mostrarToast("Adicione pelo menos uma faixa!", "erro");
    }

    const media = parseFloat((somaNotas / faixas.length).toFixed(2));
    const nmp = parseFloat(((media / 10) * 100).toFixed(1));
    const agoraISO = new Date().toISOString();

    const salvandoReaudicao = reaudicaoModoAtivo;
    let idFirestoreCriado = null;
    const registroEmEdicao = reaudicaoEditandoId
      ? reaudicoesLista.find((item) => item.id === reaudicaoEditandoId)
      : null;
    if (salvandoReaudicao) {
      const registroHistorico = {
        nome, banda, ano, imagem: imagemFinal, favorita, obs, faixas,
        media, somaNotas, nmp, duracao, duracaoSegundos,
        userId: usuarioAtual.uid,
        origem: registroEmEdicao?.origem || (reaudicaoAlbumOriginal?.tipoCatalogo === 'caderno' ? 'caderno_antigo' : (reaudicaoAlbumOriginal ? 'album_principal' : 'avaliacao_manual')),
        albumIdOriginal: registroEmEdicao?.albumIdOriginal || (reaudicaoAlbumOriginal?.tipoCatalogo === 'album' ? reaudicaoAlbumOriginal.id : null),
        notaOriginal: registroEmEdicao ? registroEmEdicao.notaOriginal : reaudicaoAlbumOriginal ? Number(reaudicaoAlbumOriginal.media) : null,
        notaAntiga: registroEmEdicao ? registroEmEdicao.notaAntiga : reaudicaoAlbumOriginal?.tipoCatalogo === 'caderno' ? Number(reaudicaoAlbumOriginal.notaAntiga ?? reaudicaoAlbumOriginal.notaOriginal) : null,
        dataOriginal: registroEmEdicao ? registroEmEdicao.dataOriginal : reaudicaoAlbumOriginal?.criadoEm || null,
        dataReouvido: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        integradoAlbumPrincipal: true,
        registroRapido: false
      };
      if (registroEmEdicao) {
        await updateDoc(obterRefReaudicao(registroEmEdicao), registroHistorico);
      } else if (reaudicaoAlbumOriginal?.tipoCatalogo === 'caderno') {
        await updateDoc(obterRefReaudicao(reaudicaoAlbumOriginal), registroHistorico);
      } else {
        const novoHistorico = await addDoc(collection(db, 'historico_reaudicoes'), { ...registroHistorico, criadoEm: serverTimestamp() });
        idFirestoreCriado = obterSufixoTimerReaudicao({
          ...registroHistorico,
          colecaoDados: 'historico_reaudicoes',
          firestoreId: novoHistorico.id
        });
      }
      mostrarToast('Ré-audição salva no histórico!');
    } else if (id) {
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
      const novoAlbum = await addDoc(collection(db, "albuns"), novoData);
      idFirestoreCriado = `album:${novoAlbum.id}`;
      mostrarToast("Álbum cadastrado com sucesso!");
    }

    const timerEraRascunho = String(timerAudicaoId || '').startsWith('rascunho-');
    if (idFirestoreCriado && timerEraRascunho) migrarTimerAudicao(idFirestoreCriado);
    pausarTimerAudicao();
    if (timerEraRascunho) limparTimerRascunhoSalvo();
    prepararNovoAlbum();
    navegarPara(salvandoReaudicao ? 'sec-reaudicoes' : 'sec-dashboard');

  } catch (erro) {
    console.error('Erro ao salvar avaliação:', erro);
    mostrarToast("Erro ao salvar!", "erro");
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = reaudicaoModoAtivo ? 'Salvar no Histórico' : 'Salvar Álbum';
  }
});

// LISTAR E RENDERIZAR
async function carregarAlbuns() {
  const grid = document.getElementById('lista-albuns');
  grid.innerHTML = 'Carregando...';

  try {
    const snapshot = await getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid)));
    const documentosHistorico = [];
    try {
      const historico = await getDocs(query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid)));
      historico.docs.forEach((docSnap) => documentosHistorico.push({ id: docSnap.id, data: docSnap.data(), origemColecao: 'historico' }));
    } catch (erro) {
      console.error('Não foi possível consultar historico_reaudicoes:', erro);
      reaudicoesLista.forEach((registro) => documentosHistorico.push({ id: registro.id, data: registro, origemColecao: 'cache' }));
    }
    try {
      const legados = await getDocs(query(collection(db, 'reaudicoes'), where('userId', '==', usuarioAtual.uid)));
      const idsPresentes = new Set(documentosHistorico.map((item) => `${item.origemColecao}:${item.id}`));
      reaudicoesLegadas = [];
      legados.docs.forEach((docSnap) => {
        if (idsPresentes.has(`historico:${docSnap.id}`)) return;
        const registro = normalizarDocumentoReaudicao(docSnap.id, docSnap.data(), 'reaudicoes');
        reaudicoesLegadas.push(registro);
        documentosHistorico.push({ id: registro.id, data: registro, origemColecao: 'legado' });
      });
      const atuais = reaudicoesLista.filter((item) => item.colecaoDados !== 'reaudicoes');
      reaudicoesLista = [...atuais, ...reaudicoesLegadas];
      renderizarReaudicoes();
    } catch (erro) {
      console.info('Coleção legada reaudicoes indisponível; mantendo as coleções atuais.');
    }

    todosOsAlbuns = [];
    snapshot.docs.forEach((docSnap) => {
      const album = { id: docSnap.id, ...docSnap.data() };
      if (registroVeioDoCaderno(album)) todosOsAlbuns.push(...criarCardCaderno(album, album.id));
      else if (!album.isReaudicao && !album.integradoAlbumPrincipal) todosOsAlbuns.push(album);
    });

    documentosHistorico.forEach(({ id, data: registro }) => {
      if (registroVeioDoCaderno(registro)) {
        todosOsAlbuns.push(...criarCardCaderno(registro, id));
        return;
      }
      const nome = registro.nomeAlbum || registro.album || registro.nome || registro.titulo;
      const media = Number.parseFloat(registro.notaAtual ?? registro.media ?? registro.nota);
      if (!nome || !Number.isFinite(media)) return;
      todosOsAlbuns.push({
        ...registro,
        id: `reaudicao-${id}`,
        historicoId: id,
        nome,
        banda: registro.nomeBanda || registro.banda || registro.artista || '',
        imagem: registro.imagem || registro.capa || '',
        media,
        notaAtual: media,
        nmp: Number(registro.nmp || media * 10),
        isReaudicao: true,
        criadoEm: converterDataReaudicao(registro.dataReouvido || registro.criadoEm),
        atualizadoEm: converterDataReaudicao(registro.atualizadoEm || registro.dataReouvido)
      });
    });

    const totalSegundosEscuta = todosOsAlbuns.reduce((total, album) => total + Math.max(0, Number(album.duracaoSegundos || 0)), 0);
    const totalEscutas = todosOsAlbuns.length;
    document.getElementById('dashboard-total-registros').textContent = `${totalEscutas} registros`;
    document.getElementById('dashboard-tempo-total').textContent = formatarDuracao(totalSegundosEscuta);

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
    const bateNome = (album.nome || '').toLowerCase().includes(termo);
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
  const notasDashboard = todosOsAlbuns.map((album) => Number.parseFloat(album.media)).filter(Number.isFinite);
  const menorNotaDashboard = notasDashboard.length ? Math.min(...notasDashboard) : 0;
  const maiorNotaDashboard = notasDashboard.length ? Math.max(...notasDashboard) : 10;

  albunsExibidos.forEach(data => {
    const dataCriacao = data.criadoEm ? formatarDataReaudicao(data.criadoEm) : 'N/A';
    const dataEdicao = data.atualizadoEm ? formatarDataReaudicao(data.atualizadoEm) : 'N/A';

    const temObs = data.obs && data.obs.trim().length > 0;
    const duracaoAlbum = String(data.duracao || (data.duracaoSegundos ? formatarDuracao(data.duracaoSegundos) : '')).trim();

    const card = document.createElement('div');
    const notaBaselineCard = Number(data.notaAntiga ?? data.notaOriginal ?? data.notaCaderno ?? data.media ?? 0);
    const notaAtualCard = Number(data.notaAtual ?? data.media ?? 0);
    card.className = 'card-album nota-gradiente';
    card.style.setProperty('--nota-cor', calcularCorPorNota(data.media, menorNotaDashboard, maiorNotaDashboard));
    card.innerHTML = `
      <div class="card-cabecalho">
        <div class="badges-notas">
          <span class="nota-badge">${Number(data.media || 0).toFixed(1)}</span>
          <span class="badge-nmp">${data.nmp || 0}% NMP</span>
          ${data.isReaudicao ? '<span class="badge-reaudicao">Ré-audição 🔄</span>' : data.isCaderno ? '<span class="badge-reaudicao badge-caderno">Caderno 📓</span>' : ''}
        </div>
      </div>
      <h3>${escaparHtml(data.nome || 'Álbum sem nome')} (${escaparHtml(data.ano || '—')})</h3>
      <p class="album-artist">${escaparHtml(data.banda || 'Banda não informada')}</p>

      ${data.imagem ? `<img src="${escaparHtml(data.imagem)}" alt="Capa" onerror="this.src='https://via.placeholder.com/200?text=Sem+Capa'">` : ''}

      ${data.isCaderno ? `<p class="reaudicao-card-comparativo">Nota Caderno: ${notaBaselineCard.toFixed(1)} · 1ª escuta: ${formatarDataReaudicao(data.dataOriginal)}${data.cadernoPareado ? ` → Ré-audição: ${notaAtualCard.toFixed(1)} · ${formatarDataReaudicao(data.dataReouvido)}` : ''}</p>` : ''}
      ${data.isReaudicao && data.notaOriginal !== null && data.notaOriginal !== undefined ? `<p class="reaudicao-card-comparativo">${data.origem === 'caderno_antigo' ? 'Nota Caderno' : 'Nota original'}: ${Number(data.notaOriginal).toFixed(1)} → Nova Nota: ${Number(data.media || 0).toFixed(1)} (${Number(data.media || 0) - Number(data.notaOriginal) > 0 ? '+' : ''}${(Number(data.media || 0) - Number(data.notaOriginal)).toFixed(1)})${data.origem === 'caderno_antigo' ? ` · 1ª escuta: ${formatarDataReaudicao(data.dataOriginal)} · Reouvido: ${formatarDataReaudicao(data.dataReouvido)}` : ''}</p>` : data.isReaudicao ? '<p class="reaudicao-card-comparativo">Primeira avaliação registrada no histórico</p>' : ''}

      <p><strong>Soma das Notas:</strong> ${data.somaNotas ?? 'N/A'}</p>
      <p><strong>Música favorita:</strong> ${escaparHtml(data.favorita || 'N/A')}</p>
      <p><strong>Faixas:</strong> ${Array.isArray(data.faixas) ? data.faixas.length : 0}</p>
      ${duracaoAlbum ? `<p><strong>Duração:</strong> ${escaparHtml(duracaoAlbum)}</p>` : ''}
      ${!data.isReaudicao && !data.isCaderno ? `<p><strong>Idade no cadastro:</strong> ${data.idadeNoCadastro ?? 'N/A'} anos</p>` : ''}

      ${temObs && !data.isReaudicao ? `<button type="button" class="btn-obs" data-album-obs="${data.id}">Ver observações</button>` : ''}

      <div class="card-datas">
        Cadastrado: ${dataCriacao}<br>
        Última modificação: ${dataEdicao}
      </div>

      <div class="card-acoes">
        ${data.isCaderno ? `<button type="button" class="btn-alerta" data-dashboard-caderno-editar="${escaparHtml(data.historicoId)}">Editar</button><button type="button" class="btn-perigo" data-dashboard-caderno-excluir="${escaparHtml(data.historicoId)}">Excluir</button>` : data.isReaudicao ? `<button type="button" class="btn-alerta" data-dashboard-reaudicao-editar="${escaparHtml(data.historicoId)}">Editar</button><button type="button" class="btn-perigo" data-dashboard-reaudicao-excluir="${escaparHtml(data.historicoId)}">Excluir</button>` : `<button onclick="editarAlbum('${data.id}')" class="btn-alerta">Editar</button><button onclick="deletarAlbum('${data.id}')" class="btn-perigo">Excluir</button>`}
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('info-pagina').innerText = `Página ${paginaAtual} de ${totalPaginas}`;
  document.getElementById('btn-pag-ant').disabled = (paginaAtual === 1);
  document.getElementById('btn-pag-prox').disabled = (paginaAtual === totalPaginas);
}

document.getElementById('lista-albuns')?.addEventListener('click', async (event) => {
  const editarCaderno = event.target.closest('[data-dashboard-caderno-editar]');
  const excluirCaderno = event.target.closest('[data-dashboard-caderno-excluir]');
  const editarReaudicao = event.target.closest('[data-dashboard-reaudicao-editar]');
  const excluirReaudicao = event.target.closest('[data-dashboard-reaudicao-excluir]');
  const origemComparacoes = document.getElementById('lista-reaudicoes');
  if (editarCaderno || excluirCaderno || editarReaudicao || excluirReaudicao) {
    const [atributo, id] = editarCaderno
      ? ['data-caderno-editar', editarCaderno.dataset.dashboardCadernoEditar]
      : excluirCaderno
        ? ['data-caderno-excluir', excluirCaderno.dataset.dashboardCadernoExcluir]
        : editarReaudicao
          ? ['data-reaudicao-editar', editarReaudicao.dataset.dashboardReaudicaoEditar]
          : ['data-reaudicao-excluir', excluirReaudicao.dataset.dashboardReaudicaoExcluir];
    origemComparacoes?.querySelector(`[${atributo}="${CSS.escape(id)}"]`)?.click();
    return;
  }
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
    definirTimerAudicao(data.duracaoSegundos || 0, id);
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
    const [snapshot, historicoSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid))),
      getDocs(query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid)))
    ]);
    const grupos = new Map();

    const albuns = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .filter((album) => !album.isReaudicao && !album.integradoAlbumPrincipal)
      .map((album) => ({ ...album, isReaudicao: false, isCaderno: false, origemRegistro: 'Inédito' }));
    const historico = historicoSnapshot.docs.flatMap((docSnap) => criarRegistrosHistoricoEstatisticas(docSnap.id, docSnap.data()));
    selecionarRegistrosUnicosPorAlbum([...albuns, ...historico]).forEach((album) => {
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
                  <span title="${escaparHtml(album.nome || 'Álbum sem nome')}">${escaparHtml(album.nome || 'Álbum sem nome')} - ${escaparHtml(album.ano || 'N/A')} · ${escaparHtml(album.origemRegistro || 'Inédito')}</span>
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

function lerCapaCadernoCompactada(input) {
  const arquivo = input?.files?.[0];
  if (!arquivo) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(leitor.error || new Error('Não foi possível ler o arquivo da capa.'));
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onerror = () => reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      imagem.onload = () => {
        const maxLado = 700;
        const escala = Math.min(1, maxLado / Math.max(imagem.width, imagem.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(imagem.width * escala));
        canvas.height = Math.max(1, Math.round(imagem.height * escala));
        canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.76));
      };
      imagem.src = leitor.result;
    };
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

function renderizarGraficoAtividade(registros) {
  const canvas = document.getElementById('graficoAtividadeEscutas');
  const agrupamento = document.getElementById('filtro-periodo-atividade')?.value || 'mes';
  if (!canvas || typeof Chart === 'undefined') return;
  if (graficoAtividadeEscutas) {
    graficoAtividadeEscutas.destroy();
    graficoAtividadeEscutas = null;
  }

  const mapa = new Map();
  const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  registros.forEach((registro) => {
    const data = converterDataReaudicao(registro.dataReouvido || registro.dataOriginal || registro.criadoEm);
    if (!data) return;
    let chave;
    if (agrupamento === 'semana') chave = nomesDias[data.getDay()];
    else if (agrupamento === 'ano') chave = String(data.getFullYear());
    else if (agrupamento === 'trimestre') chave = `${data.getFullYear()} T${Math.floor(data.getMonth() / 3) + 1}`;
    else chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    mapa.set(chave, (mapa.get(chave) || 0) + 1);
  });

  let labels = [...mapa.keys()];
  if (agrupamento === 'semana') {
    labels = nomesDias.filter((dia) => mapa.has(dia));
  } else {
    labels.sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  }
  graficoAtividadeEscutas = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['Sem atividade'],
      datasets: [{
        label: 'Escutas',
        data: labels.length ? labels.map((label) => mapa.get(label)) : [0],
        backgroundColor: 'rgba(52, 211, 153, 0.72)',
        borderColor: '#34d399',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      devicePixelRatio: window.devicePixelRatio || 1,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: '#cbd5e1', autoSkip: true, maxRotation: 0 }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: '#cbd5e1', precision: 0 }, grid: { color: 'rgba(255,255,255,0.08)' } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function filtrarRegistrosPorOrigem(registros, origem) {
  let filtrados = registros;
  if (origem === 'ineditos') filtrados = registros.filter((item) => !item.isReaudicao && !item.isCaderno);
  if (origem === 'caderno') filtrados = registros.filter((item) => item.isCaderno);
  if (origem === 'reaudicoes') filtrados = registros.filter((item) => item.isReaudicao);
  return selecionarRegistrosUnicosPorAlbum(filtrados);
}

function selecionarRegistrosUnicosPorAlbum(registros) {
  const unicos = new Map();
  const prioridade = (registro) => registro.isReaudicao ? 2 : registro.isCaderno ? 1 : 0;
  const dataDoRegistro = (registro) => converterDataReaudicao(registro.dataReouvido || registro.criadoEm || registro.atualizadoEm)?.getTime() || 0;

  registros.forEach((registro) => {
    const temIdentidade = normalizarTexto(registro.banda) && normalizarTexto(registro.nome);
    const chaveFinal = temIdentidade
      ? criarChaveAlbum(registro.banda, registro.nome)
      : `registro_${registro.id}`;
    const existente = unicos.get(chaveFinal);
    if (!existente || prioridade(registro) > prioridade(existente) ||
      (prioridade(registro) === prioridade(existente) && dataDoRegistro(registro) > dataDoRegistro(existente))) {
      unicos.set(chaveFinal, registro);
    }
  });
  return [...unicos.values()];
}

function criarRegistrosHistoricoEstatisticas(id, dado) {
  const ehCaderno = registroVeioDoCaderno(dado);
  const nomeAlbum = dado.nomeCaderno || dado.nomeAlbum || dado.album || dado.nome || 'Álbum sem nome';
  const nomeBanda = dado.bandaCaderno || dado.nomeBanda || dado.banda || 'Artista não informado';
  const notaAntiga = Number.parseFloat(dado.notaAntiga ?? dado.notaOriginal ?? dado.notaCaderno ?? dado.mediaAntiga);
  const registros = [];

  if (ehCaderno && Number.isFinite(notaAntiga)) {
    registros.push({
      id: `${id}-caderno`,
      ...dado,
      nome: nomeAlbum,
      banda: nomeBanda,
      media: notaAntiga,
      criadoEm: converterDataReaudicao(dado.dataOriginal || dado.dataReouvido || dado.criadoEm),
      isReaudicao: false,
      isCaderno: true,
      origemRegistro: 'Caderno antigo'
    });
  }

  const notaAtual = Number.parseFloat(dado.notaAtual ?? dado.media ?? dado.nota);
  if ((!ehCaderno || dado.integradoAlbumPrincipal) && Number.isFinite(notaAtual)) {
    registros.push({
      id: `${id}-reaudicao`,
      ...dado,
      nome: nomeAlbum,
      banda: nomeBanda,
      media: notaAtual,
      criadoEm: converterDataReaudicao(dado.dataReouvido || dado.criadoEm),
      isReaudicao: true,
      isCaderno: false,
      origemRegistro: 'Ré-audição'
    });
  }
  return registros;
}

document.getElementById('filtro-tipo-estatistica').addEventListener('change', carregarEstatisticas);
document.getElementById('filtro-periodo-atividade').addEventListener('change', () => {
  const tipo = document.getElementById('filtro-tipo-estatistica').value;
  renderizarGraficoAtividade(filtrarRegistrosPorOrigem(registrosEstatisticas, tipo));
});

// ESTATÍSTICAS
async function carregarEstatisticas() {
  const [albunsSnapshot, historicoSnapshot] = await Promise.all([
    getDocs(query(collection(db, 'albuns'), where('userId', '==', usuarioAtual.uid))),
    getDocs(query(collection(db, 'historico_reaudicoes'), where('userId', '==', usuarioAtual.uid)))
  ]);
  const albunsIneditos = albunsSnapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((album) => !album.isReaudicao && !album.integradoAlbumPrincipal)
    .map((album) => ({ ...album, isReaudicao: false, isCaderno: false, origemRegistro: 'Inédito' }));
  const historico = historicoSnapshot.docs.flatMap((docSnap) => criarRegistrosHistoricoEstatisticas(docSnap.id, docSnap.data()));
  registrosEstatisticas = [...albunsIneditos, ...historico];
  const filtro = document.getElementById('filtro-tipo-estatistica').value;
  const albuns = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro);
  renderizarGraficoAtividade(albuns);

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
    document.getElementById('stat-tendencia').innerText = '-';
    document.getElementById('stat-mes-produtivo').innerText = '-';
    document.getElementById('stat-album-longo').innerText = '-';
    document.getElementById('stat-album-curto').innerText = '-';
    document.getElementById('stat-correlacao-duracao').innerText = '-';
    atualizarMetricasAudicao([]);
    [window.graficoBandasChart, window.graficoDispersaoBandasChart, window.graficoDecadasChart, window.meuGrafico].forEach((chart) => chart?.destroy());
    window.graficoBandasChart = null;
    window.graficoDispersaoBandasChart = null;
    window.graficoDecadasChart = null;
    window.meuGrafico = null;
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