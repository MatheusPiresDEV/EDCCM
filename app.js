import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
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
let meuGrafico = null;
let graficoDecadasChart = null;
let imagemBase64Temp = "";
let todosOsAlbuns = [];
let albunsFiltrados = [];
let paginaAtual = 1;
let top5ListaCompleta = [];
let top5Unsubscribe = null;
let viagensUnsubscribe = null;
let observacoesUnsubscribe = null;
const ITENS_POR_PAGINA = 12;

function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = mensagem;
  toast.className = `toast ${tipo}`;
  toast.classList.remove('escondido');

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.add('escondido'), 3000);
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
  document.querySelectorAll('.tela').forEach(t => t.classList.add('escondido'));
  const telaDestino = document.getElementById(idTela);
  if (telaDestino) telaDestino.classList.remove('escondido');

  const mapeamento = {
    'sec-dashboard': 'sec-dashboard',
    'sec-novo-album': 'sec-novo-album',
    'sec-top5': 'sec-top5',
    'sec-viagens': 'sec-viagens',
    'sec-observacoes': 'sec-observacoes',
    'sec-estatisticas': 'sec-estatisticas'
  };

  document.querySelectorAll('.nav-btn').forEach((button) => {
    const alvo = button.getAttribute('data-target');
    const ativo = alvo === mapeamento[idTela];
    button.classList.toggle('active', ativo);
    button.setAttribute('aria-current', ativo ? 'page' : 'false');
  });

  fecharMenuMobile();

  if (idTela === 'sec-dashboard') carregarAlbuns();
  if (idTela === 'sec-estatisticas') carregarEstatisticas();
};

window.prepararNovoAlbum = function() {
  document.getElementById('form-album').reset();
  document.getElementById('album-id').value = '';
  document.getElementById('container-faixas').innerHTML = '';
  document.getElementById('preview-container').classList.add('escondido');
  document.getElementById('form-titulo').innerText = 'Novo Álbum';
  imagemBase64Temp = "";
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

document.getElementById('btn-logout').addEventListener('click', () => {
  signOut(auth).then(() => bloquearTela());
});

onAuthStateChanged(auth, (user) => {
  const lockscreen = document.getElementById('lockscreen');

  if (top5Unsubscribe) top5Unsubscribe();
  if (viagensUnsubscribe) viagensUnsubscribe();
  if (observacoesUnsubscribe) observacoesUnsubscribe();

  if (user) {
    usuarioAtual = user;
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
          <button type="button" class="btn-obs" data-top5-historico="${top.id}">Histórico</button>
        </div>
      </div>
    `;
  }).join('');
};

document.getElementById('btn-novo-top5').addEventListener('click', () => {
  document.getElementById('form-top5').reset();
  document.getElementById('top5-id').value = '';
  document.getElementById('top5-titulo').focus();
});

document.getElementById('btn-cancelar-top5').addEventListener('click', () => {
  document.getElementById('form-top5').reset();
  document.getElementById('top5-id').value = '';
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
      const mensagem = `Alteração em “${antigo.titulo || 'Top 5'}” para “${titulo}”. Itens atualizados.`;
      const logsExistentes = Array.isArray(antigo.historicoLogs) ? antigo.historicoLogs : [];
      await updateDoc(doc(db, 'viagens', id), {
        titulo,
        itens,
        atualizadoEm: serverTimestamp(),
        historicoLogs: [
          ...logsExistentes,
          {
            data: new Date().toISOString(),
            alteracao: mensagem
          }
        ]
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
        atualizadoEm: serverTimestamp(),
        historicoLogs: [{
          data: new Date().toISOString(),
          alteracao: 'Top 5 criado.'
        }]
      });
      mostrarToast('Top 5 salvo com sucesso!');
    }

    document.getElementById('form-top5').reset();
    document.getElementById('top5-id').value = '';
  } catch (erro) {
    console.error('Erro ao salvar Top 5:', erro);
    mostrarToast('Erro ao salvar o Top 5', 'erro');
  }
});

document.getElementById('lista-top5').addEventListener('click', async (event) => {
  const editarId = event.target.dataset.top5Editar;
  const excluirId = event.target.dataset.top5Excluir;
  const historicoId = event.target.dataset.top5Historico;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;

    document.getElementById('top5-id').value = editarId;
    document.getElementById('top5-titulo').value = dados.titulo || '';
    Array.from({ length: 5 }, (_, index) => index + 1).forEach((numero) => {
      document.getElementById(`top5-item-${numero}`).value = (dados.itens && dados.itens[numero - 1]) || '';
    });

    document.getElementById('top5-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Deseja excluir este Top 5?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Top 5 removido!');
    }
  }

  if (historicoId) {
    const docSnap = await getDoc(doc(db, 'viagens', historicoId));
    const dados = docSnap.data() || {};
    const logs = Array.isArray(dados.historicoLogs) ? dados.historicoLogs : [];
    const container = document.getElementById('top5-historico-conteudo');
    if (!container) return;
    container.innerHTML = logs.length
      ? logs.map(item => `<div class="historico-item"><small>${formatarDataHora(item.data)}</small><div>${item.alteracao || 'Sem descrição'}</div></div>`).join('')
      : '<p>Sem histórico de alterações.</p>';
    document.getElementById('modal-top5-historico').classList.remove('escondido');
  }
});

window.fecharModalTop5 = function(forcar = false, evento = null) {
  const modal = document.getElementById('modal-top5-historico');
  if (!modal) return;
  if (forcar || (evento && evento.target === modal)) modal.classList.add('escondido');
};

// VIAGENS
function addLinhaTarefa(texto = '', concluida = false, criadoEm = null) {
  const container = document.getElementById('container-viagem-tarefas');
  const row = document.createElement('div');
  row.className = 'tarefa-input-row';
  row.innerHTML = `
    <input type="text" value="${texto}" class="tarefa-input" placeholder="Ex: Comprar passagens" ${concluida ? 'readonly' : ''}>
    <button type="button" class="btn-perigo btn-remove-tarefa">X</button>
  `;

  if (criadoEm) row.dataset.criadoEm = String(criadoEm);
  if (concluida) row.dataset.concluida = 'true';
  row.querySelector('.btn-remove-tarefa').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

function subscribeViagens() {
  if (!usuarioAtual) return;

  const q = query(collection(db, 'viagens'), where('userId', '==', usuarioAtual.uid));
  if (viagensUnsubscribe) viagensUnsubscribe();

  viagensUnsubscribe = onSnapshot(q, (snapshot) => {
    const lista = [];
    snapshot.forEach((item) => lista.push({ id: item.id, ...item.data() }));
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

      return `
        <div class="viagem-card ${realizada ? 'viagem-feita' : ''}">
          <div class="card-cabecalho">
            <h3>${viagem.titulo || 'Viagem'}</h3>
            <span class="badge-duracao ${realizada ? 'feito' : ''}">${realizada ? 'Concluída' : 'Pendente'}</span>
          </div>

          <label class="viagem-status-row">
            <input type="checkbox" data-viagem-toggle="${viagem.id}" ${realizada ? 'checked' : ''}>
            <span>Marcar como feita</span>
          </label>

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
  });
}

document.getElementById('btn-nova-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
  document.getElementById('viagem-titulo').focus();
});

document.getElementById('btn-cancelar-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
});

document.getElementById('form-viagem').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('viagem-id').value;
  const titulo = document.getElementById('viagem-titulo').value.trim();

  if (!titulo) {
    return mostrarToast('Informe o nome da viagem.', 'erro');
  }

  try {
    if (id) {
      await updateDoc(doc(db, 'viagens', id), {
        titulo,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Viagem atualizada!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        titulo,
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
  const checkbox = event.target.closest('[data-viagem-toggle]');
  if (!checkbox) return;

  const viagemId = checkbox.dataset.viagemToggle;
  const concluida = checkbox.checked;

  await updateDoc(doc(db, 'viagens', viagemId), {
    realizada: concluida,
    realizadaEm: concluida ? serverTimestamp() : null,
    atualizadoEm: serverTimestamp()
  });

  mostrarToast(concluida ? 'Viagem marcada como feita!' : 'Viagem reaberta.');
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
          <button type="button" class="btn-obs" data-obs-historico="${nota.id}">Histórico</button>
        </div>
      </div>
    `).join('');
  });
}

document.getElementById('btn-nova-observacao').addEventListener('click', () => {
  document.getElementById('form-observacao').reset();
  document.getElementById('obs-id').value = '';
  document.getElementById('obs-titulo').focus();
});

document.getElementById('btn-cancelar-observacao').addEventListener('click', () => {
  document.getElementById('form-observacao').reset();
  document.getElementById('obs-id').value = '';
});

document.getElementById('form-observacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('obs-id').value;
  const titulo = document.getElementById('obs-titulo').value.trim();
  const conteudo = document.getElementById('obs-conteudo').value.trim();

  if (!titulo || !conteudo) {
    return mostrarToast('Preencha título e conteúdo da anotação.', 'erro');
  }

  try {
    if (id) {
      const docSnap = await getDoc(doc(db, 'viagens', id));
      const antiga = docSnap.data() || {};
      const textoAnterior = antiga.conteudo || '';
      const tituloAnterior = antiga.titulo || '';
      const alteracao = `Título: ${tituloAnterior} -> ${titulo} | Conteúdo: ${textoAnterior} -> ${conteudo}`;
      const logsExistentes = Array.isArray(antiga.historicoLogs) ? antiga.historicoLogs : [];
      await updateDoc(doc(db, 'viagens', id), {
        titulo,
        conteudo,
        atualizadoEm: serverTimestamp(),
        historicoLogs: [
          ...logsExistentes,
          {
            data: new Date().toISOString(),
            alteracao
          }
        ]
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
        atualizadoEm: serverTimestamp(),
        historicoLogs: [{
          data: new Date().toISOString(),
          alteracao: 'Observação criada.'
        }]
      });
      mostrarToast('Anotação salva!');
    }

    document.getElementById('form-observacao').reset();
    document.getElementById('obs-id').value = '';
  } catch (erro) {
    console.error('Erro ao salvar observação:', erro);
    mostrarToast('Erro ao salvar observação.', 'erro');
  }
});

document.getElementById('lista-observacoes').addEventListener('click', async (event) => {
  const editarId = event.target.dataset.obsEditar;
  const excluirId = event.target.dataset.obsExcluir;
  const historicoId = event.target.dataset.obsHistorico;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;
    document.getElementById('obs-id').value = editarId;
    document.getElementById('obs-titulo').value = dados.titulo || '';
    document.getElementById('obs-conteudo').value = dados.conteudo || '';
    document.getElementById('obs-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Excluir esta anotação?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Anotação excluída!');
    }
  }

  if (historicoId) {
    const docSnap = await getDoc(doc(db, 'viagens', historicoId));
    const dados = docSnap.data() || {};
    const logs = Array.isArray(dados.historicoLogs) ? dados.historicoLogs : [];
    const container = document.getElementById('obs-historico-conteudo');
    if (!container) return;
    container.innerHTML = logs.length
      ? logs.map(item => `<div class="historico-item"><small>${formatarDataHora(item.data)}</small><div>${item.alteracao || 'Sem descrição'}</div></div>`).join('')
      : '<p>Sem histórico de revisões.</p>';
    document.getElementById('modal-obs-historico').classList.remove('escondido');
  }
});

window.fecharModalObsHistorico = function(forcar = false, evento = null) {
  const modal = document.getElementById('modal-obs-historico');
  if (!modal) return;
  if (forcar || (evento && evento.target === modal)) modal.classList.add('escondido');
};

// inicialização básica das listas de forma segura
if (document.readyState !== 'loading') {
  const tarefasContainerInicial = document.getElementById('container-viagem-tarefas');
  if (tarefasContainerInicial) {
    tarefasContainerInicial.innerHTML = '';
    tarefasContainerInicial.appendChild(Object.assign(document.createElement('div'), { className: 'tarefa-input-row' }));
  }
}

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

function addLinhaFaixa(nome = '', nota = 'Boa') {
  const div = document.createElement('div');
  div.className = 'linha-faixa';
  div.innerHTML = `
    <input type="text" placeholder="Nome da música (opcional)" value="${nome}" class="faixa-nome">
    <select class="faixa-nota">
      ${Object.keys(PESO_NOTAS).map(k => `<option value="${k}" ${k === nota ? 'selected' : ''}>${k} (${PESO_NOTAS[k]})</option>`).join('')}
    </select>
    <button type="button" onclick="this.parentElement.remove()" class="btn-perigo">X</button>
  `;
  containerFaixas.appendChild(div);
}

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
        media, somaNotas, nmp, atualizadoEm: agoraISO
      };
      await updateDoc(doc(db, "albuns", id), updateData);
      mostrarToast("Álbum atualizado com sucesso!");
    } else {
      const idadeCadastro = calcularIdade(new Date());
      const novoData = {
        nome, banda, ano, imagem: imagemFinal, favorita, obs, faixas,
        media, somaNotas, nmp,
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
    const obsSanitizada = temObs ? data.obs.replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';

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
      <p><strong>Idade no cadastro:</strong> ${data.idadeNoCadastro ?? 'N/A'} anos</p>

      ${temObs ? `<button type="button" class="btn-obs" onclick="abrirModalObs('${obsSanitizada}')">Ver observações</button>` : ''}

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
    document.getElementById('stat-decada-media').innerText = '-';
    document.getElementById('stat-decada-qtd').innerText = '-';
    document.getElementById('stat-dia-ativo').innerText = '-';
    document.getElementById('stat-dias-off').innerText = '-';
    return;
  }

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

  // --- GRÁFICO 1: DÉCADAS ---
  const ctxDecadas = document.getElementById('graficoDecadas').getContext('2d');
  if (window.graficoDecadasChart) window.graficoDecadasChart.destroy();

  window.graficoDecadasChart = new Chart(ctxDecadas, {
    type: 'bar',
    data: {
      labels: labelsDecadas.map(d => `${d}s`),
      datasets: [{
        label: 'Nota Média por Década',
        data: mediasDecadas,
        backgroundColor: '#3498db',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite expandir a altura no container CSS
      plugins: {
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        y: { min: 0, max: 10, ticks: { color: '#fff' } },
        x: { ticks: { color: '#fff' } }
      }
    }
  });

  // --- GRÁFICO 2: NOTA X ANO DE LANÇAMENTO ---
  const albunsPorAno = [...albuns].sort((a, b) => a.ano - b.ano);
  const labelsAnos = albunsPorAno.map(a => `${a.nome} (${a.ano})`);
  const notas = albunsPorAno.map(a => a.media);

  const ctx = document.getElementById('graficoCorrelacao').getContext('2d');
  if (window.meuGrafico) window.meuGrafico.destroy();

  window.meuGrafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelsAnos,
      datasets: [{
        label: 'Nota Média do Álbum',
        data: notas,
        borderColor: '#1db954',
        backgroundColor: 'rgba(29, 185, 84, 0.2)',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: '#1db954',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite expandir a altura no container CSS
      plugins: {
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        x: { 
          title: { display: true, text: 'Álbuns (Ordenados por Ano)', color: '#fff' }, 
          ticks: { 
            color: '#fff',
            autoSkip: false, // Garante visibilidade dos rótulos mesmo com muitos álbuns
            maxRotation: 45,
            minRotation: 45
          } 
        },
        y: { 
          min: 0, max: 10,
          title: { display: true, text: 'Nota Média', color: '#fff' }, 
          ticks: { color: '#fff' } 
        }
      }
    }
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