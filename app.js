import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail
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
if (typeof Chart !== 'undefined') {
  Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;
  Chart.defaults.color = '#b7b2a8';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 16, 15, 0.96)';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(191, 145, 78, 0.34)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#f1eadc';
  Chart.defaults.plugins.tooltip.bodyColor = '#d1c9ba';
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 9;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 5;
  Chart.defaults.plugins.legend.labels.color = '#c9c2b5';
  Chart.defaults.plugins.legend.labels.padding = 18;
}

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

// CENÁRIO ORIGINAL ANIMADO: MONTANHA, FUMAÇA E ATIVIDADE VULCÂNICA
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let particulas = [];
let larguraCanvas = window.innerWidth;
let alturaCanvas = window.innerHeight;
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
let ultimaFrameFundo = 0;
const intervaloFrameFundo = 1000 / 30;
const pontosMontanha = [
  [0, 0.77], [0.09, 0.72], [0.17, 0.75], [0.29, 0.57], [0.37, 0.61],
  [0.49, 0.28], [0.55, 0.4], [0.63, 0.35], [0.73, 0.59], [0.82, 0.63],
  [0.91, 0.57], [1, 0.7], [1, 1], [0, 1]
];

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function criarParticulas() {
  const quantidade = window.innerWidth < 680 ? 70 : 150;
  particulas = Array.from({ length: quantidade }, () => ({
    x: Math.random() * larguraCanvas,
    y: Math.random() * alturaCanvas,
    raio: Math.random() * 2 + 0.5,
    velocidadeX: (Math.random() - 0.5) * 0.42,
    velocidadeY: Math.random() * 0.42 + 0.12,
    fase: Math.random() * Math.PI * 2,
    intensidade: Math.random() * 0.58 + 0.18
  }));
}

function redimensionarCanvas() {
  const escala = Math.min(window.devicePixelRatio || 1, 2);
  larguraCanvas = window.innerWidth;
  alturaCanvas = window.innerHeight;
  canvas.width = Math.round(larguraCanvas * escala);
  canvas.height = Math.round(alturaCanvas * escala);
  ctx.setTransform(escala, 0, 0, escala, 0, 0);
  criarParticulas();
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

function obterCenaDoDia() {
  const agora = new Date();
  const hora = agora.getHours() + agora.getMinutes() / 60;

  if (hora >= 5 && hora < 12) {
    return { nome: 'manha', vulcanismo: 0, fratura: 0, calor: 0, paleta: ['#14202a', '#26313a', '#c4c9c4'] };
  }
  if (hora >= 12 && hora < 18) {
    const progresso = (hora - 12) / 6;
    return {
      nome: 'tarde',
      vulcanismo: 0.12 + progresso * 0.54,
      fratura: 0.18 + progresso * 0.82,
      calor: 0.18 + progresso * 0.58,
      paleta: ['#211d1a', '#3a3028', '#d2a266']
    };
  }
  if (hora >= 18 && hora < 22) {
    const progresso = (hora - 18) / 4;
    return {
      nome: 'noite',
      vulcanismo: 0.74 + progresso * 0.2,
      fratura: 1,
      calor: 0.86 + progresso * 0.1,
      paleta: ['#100f12', '#27191a', '#df7045']
    };
  }
  return {
    nome: 'madrugada',
    vulcanismo: 1,
    fratura: 1,
    calor: 1,
    paleta: ['#090c12', '#191416', '#d65b38']
  };
}

function desenharMontanha(largura, altura, tempo, cena, parallaxX, parallaxY) {
  const deslocamento = largura * 0.012;
  const baseY = altura * 0.12;
  const montanha = ctx.createLinearGradient(0, altura * 0.22, 0, altura);
  montanha.addColorStop(0, cena.nome === 'manha' ? '#3d4a52' : '#302a27');
  montanha.addColorStop(0.52, cena.nome === 'manha' ? '#252f36' : '#211b19');
  montanha.addColorStop(1, '#111111');

  ctx.save();
  ctx.translate(parallaxX, parallaxY);
  ctx.beginPath();
  pontosMontanha.forEach(([x, y], indice) => {
    const px = x * largura + (x - 0.5) * deslocamento;
    const py = y * altura + baseY;
    if (indice === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = montanha;
  ctx.fill();

  ctx.save();
  ctx.clip();
  const facetas = [
    [[0.08, 0.78], [0.29, 0.57], [0.4, 0.76], [0.34, 1], [0.08, 1]],
    [[0.29, 0.57], [0.49, 0.28], [0.53, 0.63], [0.4, 0.76]],
    [[0.49, 0.28], [0.63, 0.35], [0.73, 0.59], [0.57, 0.74], [0.53, 0.63]],
    [[0.63, 0.35], [0.91, 0.57], [0.82, 0.8], [0.73, 0.59]]
  ];
  facetas.forEach((pontos, indice) => {
    ctx.beginPath();
    pontos.forEach(([x, y], ponto) => {
      const px = x * largura + (x - 0.5) * deslocamento;
      const py = y * altura + baseY;
      if (ponto === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = indice % 2 === 0 ? 'rgba(177, 181, 178, 0.055)' : 'rgba(8, 9, 10, 0.24)';
    ctx.fill();
  });

  ctx.strokeStyle = `rgba(207, 204, 190, ${0.08 + cena.fratura * 0.12})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(largura * 0.49, altura * 0.31 + baseY);
  ctx.lineTo(largura * 0.44, altura * 0.43 + baseY);
  ctx.lineTo(largura * 0.46, altura * 0.52 + baseY);
  ctx.lineTo(largura * 0.4, altura * 0.63 + baseY);
  ctx.moveTo(largura * 0.63, altura * 0.38 + baseY);
  ctx.lineTo(largura * 0.59, altura * 0.51 + baseY);
  ctx.lineTo(largura * 0.64, altura * 0.59 + baseY);
  ctx.lineTo(largura * 0.61, altura * 0.73 + baseY);
  ctx.moveTo(largura * 0.32, altura * 0.59 + baseY);
  ctx.lineTo(largura * 0.36, altura * 0.69 + baseY);
  ctx.lineTo(largura * 0.31, altura * 0.79 + baseY);
  ctx.stroke();
  ctx.restore();

  if (cena.fratura > 0) {
    const fragmentos = [
      [0.36, 0.63], [0.4, 0.69], [0.43, 0.58], [0.57, 0.51],
      [0.61, 0.58], [0.67, 0.55], [0.72, 0.64], [0.31, 0.68],
      [0.54, 0.65], [0.77, 0.68], [0.46, 0.74], [0.64, 0.73]
    ];
    fragmentos.forEach(([x, y], indice) => {
      const fase = tempo * (0.18 + (indice % 4) * 0.025) + indice * 2.2;
      const desvio = Math.sin(fase) * largura * 0.012 * cena.fratura;
      const queda = ((tempo * 0.012 + indice * 0.09) % 0.045) * altura * cena.fratura;
      const centroX = x * largura + desvio;
      const centroY = y * altura + baseY + queda;
      const tamanho = (2 + (indice % 4)) * (0.65 + cena.fratura * 0.55);
      ctx.save();
      ctx.translate(centroX, centroY);
      ctx.rotate(fase);
      ctx.beginPath();
      ctx.moveTo(-tamanho, -tamanho * 0.6);
      ctx.lineTo(tamanho * 0.8, -tamanho);
      ctx.lineTo(tamanho, tamanho * 0.55);
      ctx.lineTo(-tamanho * 0.35, tamanho);
      ctx.closePath();
      ctx.fillStyle = `rgba(125, 112, 101, ${cena.fratura * 0.48})`;
      ctx.fill();
      ctx.restore();
    });
  }

  const intensidadeLava = cena.vulcanismo;
  if (intensidadeLava > 0) {
    const rotasLava = [
      [[0.49, 0.31], [0.46, 0.43], [0.48, 0.51], [0.43, 0.63], [0.45, 0.77], [0.4, 0.94]],
      [[0.51, 0.32], [0.55, 0.44], [0.53, 0.53], [0.59, 0.65], [0.57, 0.76], [0.64, 0.95]],
      [[0.51, 0.33], [0.5, 0.47], [0.46, 0.56], [0.48, 0.69], [0.45, 0.82], [0.48, 0.96]],
      [[0.52, 0.34], [0.59, 0.46], [0.62, 0.56], [0.68, 0.67], [0.7, 0.83]]
    ];
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, altura * 0.26 + baseY, largura, altura);
    ctx.clip();
    rotasLava.forEach((rota, indice) => {
      const pulso = 0.74 + Math.sin(tempo * 1.8 + indice * 1.7) * 0.18;
      ctx.beginPath();
      rota.forEach(([x, y], ponto) => {
        const px = x * largura + (x - 0.5) * deslocamento;
        const py = y * altura + baseY;
        if (ponto === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.globalAlpha = intensidadeLava * pulso;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = '#f05a2a';
      ctx.shadowBlur = 24 * intensidadeLava;
      ctx.strokeStyle = '#e84926';
      ctx.lineWidth = 8 * intensidadeLava + 1;
      ctx.stroke();
      ctx.shadowBlur = 5 * intensidadeLava;
      ctx.strokeStyle = '#ffc66f';
      ctx.lineWidth = 2.2 * intensidadeLava;
      ctx.stroke();
      ctx.setLineDash([6, 18]);
      ctx.lineDashOffset = -tempo * (18 + indice * 7);
      ctx.strokeStyle = '#ffe4a0';
      ctx.lineWidth = 2.4 * intensidadeLava;
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();
  }

  const centroCrateraX = largura * 0.5 + parallaxX;
  const centroCrateraY = altura * 0.31 + baseY + parallaxY;
  const larguraCratera = largura * (0.06 + intensidadeLava * 0.025);
  const alturaCratera = altura * 0.018;
  const brilhoCratera = ctx.createRadialGradient(centroCrateraX, centroCrateraY, 1, centroCrateraX, centroCrateraY, larguraCratera * 1.8);
  brilhoCratera.addColorStop(0, `rgba(255, 139, 57, ${0.16 + intensidadeLava * 0.52})`);
  brilhoCratera.addColorStop(1, 'rgba(255, 82, 35, 0)');
  ctx.fillStyle = brilhoCratera;
  ctx.fillRect(centroCrateraX - larguraCratera * 2, centroCrateraY - larguraCratera * 2, larguraCratera * 4, larguraCratera * 4);
  ctx.beginPath();
  ctx.ellipse(centroCrateraX, centroCrateraY, larguraCratera, alturaCratera, 0, 0, Math.PI * 2);
  ctx.fillStyle = cena.nome === 'manha' ? 'rgba(8, 11, 13, 0.72)' : '#0a0808';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(centroCrateraX, centroCrateraY + alturaCratera * 0.18, larguraCratera * 0.65, alturaCratera * 0.42, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 102, 43, ${intensidadeLava * (0.38 + Math.sin(tempo * 2) * 0.12)})`;
  ctx.fill();
  ctx.restore();
}

function desenharFumaca(largura, altura, tempo, intensidade) {
  if (intensidade <= 0) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (let indice = 0; indice < 7; indice++) {
    const fase = tempo * (0.34 + indice * 0.015) + indice * 1.45;
    const x = largura * (0.49 + Math.sin(fase) * (0.018 + indice * 0.002));
    const y = altura * (0.29 - ((tempo * 0.022 + indice * 0.13) % 0.46));
    const larguraFumaca = largura * (0.035 + indice * 0.005);
    ctx.beginPath();
    ctx.moveTo(x, altura * 0.32);
    ctx.bezierCurveTo(
      x - larguraFumaca * 0.8, y + altura * 0.13,
      x + larguraFumaca * 0.8, y + altura * 0.08,
      x + Math.sin(fase + 1) * larguraFumaca, y
    );
    ctx.strokeStyle = `rgba(125, 119, 111, ${intensidade * (0.028 + (indice % 3) * 0.012)})`;
    ctx.lineWidth = 8 + indice * 3;
    ctx.shadowColor = 'rgba(130, 113, 96, 0.12)';
    ctx.shadowBlur = 20;
    ctx.stroke();
  }
  ctx.restore();
}

function animarFundo(timestamp = performance.now()) {
  if (movimentoReduzido.matches || document.hidden) return;
  if (timestamp - ultimaFrameFundo < intervaloFrameFundo) {
    requestAnimationFrame(animarFundo);
    return;
  }
  ultimaFrameFundo = timestamp;

  const cena = obterCenaDoDia();
  const larg = larguraCanvas;
  const alt = alturaCanvas;
  const tempo = performance.now() * 0.001;
  const paleta = cena.paleta;
  const focoX = larg * (0.5 + (mouse.x / Math.max(larg, 1) - 0.5) * 0.06);
  const focoY = alt * (0.42 + (mouse.y / Math.max(alt, 1) - 0.5) * 0.04);

  ctx.clearRect(0, 0, larg, alt);
  const ceu = ctx.createLinearGradient(0, 0, 0, alt);
  ceu.addColorStop(0, paleta[0]);
  ceu.addColorStop(0.55, paleta[1]);
  ceu.addColorStop(1, '#10100f');
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, larg, alt);

  const luz = ctx.createRadialGradient(focoX, focoY, 0, focoX, focoY, Math.max(larg, alt) * 0.75);
  luz.addColorStop(0, cena.nome === 'manha' ? 'rgba(142, 165, 177, 0.2)' : `rgba(214, 87, 47, ${0.04 + cena.calor * 0.15})`);
  luz.addColorStop(1, 'rgba(7, 8, 10, 0)');
  ctx.fillStyle = luz;
  ctx.fillRect(0, 0, larg, alt);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = paleta[2];
  for (let indice = 0; indice < 38; indice++) {
    const x = ((indice * 197 + tempo * (2 + (indice % 4))) % (larg + 20)) - 10;
    const y = (indice * 83) % Math.max(alt * 0.72, 1);
    ctx.fillRect(x, y, (indice % 3) + 1, (indice % 3) + 1);
  }
  ctx.restore();

  const parallaxX = (mouse.x / Math.max(larg, 1) - 0.5) * 14;
  const parallaxY = (mouse.y / Math.max(alt, 1) - 0.5) * 8;
  desenharMontanha(larg, alt, tempo, cena, parallaxX, parallaxY);
  desenharFumaca(larg, alt, tempo, Math.max(cena.fratura * 0.35, cena.vulcanismo));

  particulas.forEach((particula) => {
    const brasa = cena.vulcanismo > 0.12 && particula.y > alt * 0.24;
    particula.x += particula.velocidadeX + Math.sin(tempo + particula.fase) * 0.12;
    particula.y += brasa ? -particula.velocidadeY * (0.8 + cena.vulcanismo) : particula.velocidadeY * 0.16;
    if (particula.x < -5) particula.x = larg + 5;
    if (particula.x > larg + 5) particula.x = -5;
    if (particula.y < -8) {
      particula.y = alt + Math.random() * alt * 0.2;
      particula.x = larg * (0.35 + Math.random() * 0.3);
    }
    if (!brasa && particula.y > alt + 8) particula.y = -5;

    const parallaxParticulaX = (mouse.x / Math.max(larg, 1) - 0.5) * 12;
    const parallaxParticulaY = (mouse.y / Math.max(alt, 1) - 0.5) * 8;
    const brilho = particula.intensidade * (brasa ? cena.vulcanismo : 0.42);
    ctx.beginPath();
    ctx.fillStyle = brasa ? `rgba(255, ${Math.floor(116 + particula.intensidade * 80)}, 61, ${brilho})` : `rgba(194, 193, 184, ${brilho})`;
    ctx.shadowColor = brasa ? '#ff673b' : 'transparent';
    ctx.shadowBlur = brasa ? particula.raio * 5 : 0;
    ctx.arc(particula.x + parallaxParticulaX, particula.y + parallaxParticulaY, particula.raio * (brasa ? 1.3 : 1), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(8, 9, 10, 0.24)';
  ctx.fillRect(0, alt * 0.82, larg, alt * 0.18);

  requestAnimationFrame(animarFundo);
}
requestAnimationFrame(animarFundo);
movimentoReduzido.addEventListener?.('change', () => {
  if (!movimentoReduzido.matches && !document.hidden) {
    ultimaFrameFundo = 0;
    requestAnimationFrame(animarFundo);
  }
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !movimentoReduzido.matches) {
    ultimaFrameFundo = 0;
    requestAnimationFrame(animarFundo);
  }
});

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
let tarefasListaAtual = [];
let chaveDiaTarefasRenderizadas = '';
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
let graficoEvolucaoBandas = null;
let graficoNotaAno = null;
let graficoTendenciaTemporal = null;
let graficoPosicaoFaixas = null;
let registrosEstatisticas = [];
let albunsEvolucaoDisponiveis = [];
let bandaEvolucaoSelecionada = null;
let paginaRankingAtual = 1;
let paginaTimelineAtual = 1;
const ALBUNS_POR_PAGINA_RANKING = 5;
const ALBUNS_POR_PAGINA_TIMELINE = 15;
let timerAudicaoSegundos = 0;
let timerAudicaoIntervalo = null;
let timerAudicaoId = null;
let timerAudicaoBaseSegundos = 0;
let timerAudicaoIniciadoEm = null;
const ITENS_POR_PAGINA = 12;
const ADMIN_EMAILS = ['matheusgustavodasilvapires@gmail.com'];
const PERFIL_USERS_COLLECTION = 'usuarios';

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
    if (inputSenha) inputSenha.placeholder = 'Vazia mantém a senha atual';
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

  const idUsuario = inputId ? inputId.value : '';
  if (inputSenha) inputSenha.placeholder = idUsuario ? 'Vazia mantém a senha atual' : 'Obrigatória para nova conta';

  if (!email || (!idUsuario && !senha)) {
    mostrarToast('Informe e-mail e senha para criar uma conta.', 'erro');
    return;
  }

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
      } else {
        mostrarToast('Perfil atualizado no painel. A senha não foi alterada.', 'sucesso');
      }

      if (usuarioAtual && idUsuario === usuarioAtual.uid) mostrarToast('Usuário atualizado. A senha não foi alterada.');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      mostrarToast('Não foi possível atualizar este usuário. A senha não foi alterada.', 'erro');
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
  document.getElementById('admin-user-senha').placeholder = 'Obrigatória para nova conta';
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
    document.getElementById('admin-user-senha').placeholder = 'Obrigatória para nova conta';
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
  tarefasListaAtual = [];
  chaveDiaTarefasRenderizadas = '';
  document.getElementById('lista-tarefas-recorrentes').innerHTML = '';
  document.getElementById('lista-viagens').innerHTML = '';

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
          <button type="button" class="btn-secundario" data-top5-historico="${top.id}">Histórico</button>
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
  const alteracao = {
    titulo,
    itens,
    alteradoEm: new Date().toISOString(),
    autor: usuarioAtivo.email || ''
  };

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
        historicoTop5: arrayUnion(...(
          Array.isArray(antigo.historicoTop5) && antigo.historicoTop5.length
            ? [alteracao]
            : [{ titulo: antigo.titulo || 'Top 5', itens: antigo.itens || [], alteradoEm: antigo.atualizadoEm || antigo.criadoEm || '', autor: '' }, alteracao]
        )),
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Top 5 atualizado!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        categoria: 'top5',
        titulo,
        itens,
        historicoTop5: [alteracao],
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
  const historicoId = event.target.closest('[data-top5-historico]')?.dataset.top5Historico;
  const editarId = event.target.dataset.top5Editar;
  const excluirId = event.target.dataset.top5Excluir;

  if (historicoId) {
    const docSnap = await getDoc(doc(db, 'viagens', historicoId));
    const dados = docSnap.data() || {};
    const historico = Array.isArray(dados.historicoTop5) && dados.historicoTop5.length
      ? dados.historicoTop5
      : [{ titulo: dados.titulo || 'Top 5', itens: dados.itens || [], alteradoEm: dados.atualizadoEm || dados.criadoEm || '', autor: '' }];
    document.getElementById('modal-historico-top5-titulo').textContent = `Histórico: ${dados.titulo || 'Top 5'}`;
    document.getElementById('conteudo-historico-top5').innerHTML = [...historico].reverse().map((versao, indice) => `
      <article class="historico-top5-item">
        <div><strong>${indice === 0 ? 'Versão atual' : 'Alteração anterior'}</strong><time>${escaparHtml(formatarDataHora(versao.alteradoEm))}</time></div>
        <h4>${escaparHtml(versao.titulo || 'Top 5')}</h4>
        <ol>${(versao.itens || []).map((item) => `<li>${escaparHtml(item)}</li>`).join('')}</ol>
        ${versao.autor ? `<small>${escaparHtml(versao.autor)}</small>` : ''}
      </article>
    `).join('');
    document.getElementById('modal-historico-top5').classList.remove('escondido');
    return;
  }

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
function chavePeriodoRecorrencia(recorrencia, data = new Date()) {
  const dia = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  if (recorrencia?.frequencia === 'mensal') return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
  if (recorrencia?.frequencia === 'semanal') {
    const inicioSemana = new Date(data);
    inicioSemana.setDate(data.getDate() - ((data.getDay() + 6) % 7));
    return `semana-${inicioSemana.getFullYear()}-${String(inicioSemana.getMonth() + 1).padStart(2, '0')}-${String(inicioSemana.getDate()).padStart(2, '0')}`;
  }
  return dia;
}

function tarefaConcluidaNoPeriodo(tarefa, recorrencia, criadoEm = null) {
  if (!recorrencia?.ativa) return Boolean(tarefa.concluida);
  if (recorrencia.frequencia === 'intervalo') return false;
  if (tarefa.ultimaConclusaoEm) {
    const proximoPrazo = calcularPrazoRecorrente(tarefa, { recorrencia, criadoEm });
    return Boolean(proximoPrazo && Date.now() < proximoPrazo.getTime());
  }
  return tarefa.periodoConcluido === chavePeriodoRecorrencia(recorrencia);
}

function recorrenciaAgendadaHoje(recorrencia, data = new Date()) {
  if (!recorrencia?.ativa) return true;
  if (recorrencia.frequencia === 'diaria' || recorrencia.frequencia === 'intervalo') return true;
  if (recorrencia.frequencia === 'mensal') return data.getDate() === Number(recorrencia.diaMes);
  const dias = Array.isArray(recorrencia.diasSemana) ? recorrencia.diasSemana : [];
  return dias.includes(data.getDay());
}

function definirHorarioRecorrencia(data, horario) {
  const resultado = new Date(data);
  if (horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    resultado.setHours(hora, minuto, 0, 0);
  }
  return resultado;
}

function definirDiaDoMes(ano, mes, dia, horario) {
  const data = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  data.setDate(Math.min(Math.max(1, Number(dia) || 1), ultimoDia));
  return definirHorarioRecorrencia(data, horario);
}

function calcularPrazoRecorrente(tarefa, viagem, agora = new Date()) {
  const recorrencia = viagem.recorrencia;
  if (!recorrencia?.ativa) return null;
  const ultimaConclusao = converterDataReaudicao(tarefa.ultimaConclusaoEm);
  const criadoEm = converterDataReaudicao(tarefa.criadoEm) || converterDataReaudicao(viagem.criadoEm) || agora;

  if (recorrencia.frequencia === 'intervalo') {
    const base = ultimaConclusao || criadoEm;
    const valor = Math.max(1, Number(recorrencia.intervaloValor ?? recorrencia.intervaloDias) || 1);
    const unidade = recorrencia.intervaloUnidade || 'dias';
    const multiplicador = unidade === 'minutos' ? 60000 : unidade === 'horas' ? 3600000 : 86400000;
    return new Date(base.getTime() + valor * multiplicador);
  }

  if (recorrencia.frequencia === 'mensal') {
    const base = ultimaConclusao || criadoEm;
    let prazo = definirDiaDoMes(base.getFullYear(), base.getMonth(), recorrencia.diaMes, recorrencia.horaLimite);
    if (ultimaConclusao || prazo < criadoEm) prazo = definirDiaDoMes(base.getFullYear(), base.getMonth() + 1, recorrencia.diaMes, recorrencia.horaLimite);
    return prazo;
  }

  const horario = recorrencia.horaLimite || '23:59';
  if (recorrencia.frequencia === 'diaria') {
    const base = ultimaConclusao || criadoEm;
    const prazo = definirHorarioRecorrencia(base, horario);
    if (ultimaConclusao || prazo < criadoEm) prazo.setDate(prazo.getDate() + 1);
    return prazo;
  }

  const dias = Array.isArray(recorrencia.diasSemana) ? recorrencia.diasSemana : [];
  if (!dias.length) return null;
  const base = ultimaConclusao || criadoEm;
  const prazo = new Date(base);
  if (ultimaConclusao) prazo.setDate(prazo.getDate() + 1);
  for (let deslocamento = 0; deslocamento <= 7; deslocamento += 1) {
    if (dias.includes(prazo.getDay())) {
      const candidato = definirHorarioRecorrencia(prazo, horario);
      if (ultimaConclusao || candidato >= criadoEm) return candidato;
    }
    prazo.setDate(prazo.getDate() + 1);
  }
  return null;
}

function obterPrazoTarefa(tarefa, viagem, data = new Date()) {
  if (viagem.recorrencia?.ativa) {
    const prazo = calcularPrazoRecorrente(tarefa, viagem, data);
    return prazo && !Number.isNaN(prazo.getTime()) ? prazo : null;
  }
  if (tarefa.concluida) return null;
  let prazo;
  if (viagem.prazo) {
    prazo = new Date(viagem.prazo);
  } else if (Number(viagem.tempoMinimoMinutos) > 0) {
    const inicio = converterDataReaudicao(viagem.criadoEm) || data;
    prazo = new Date(inicio.getTime() + Number(viagem.tempoMinimoMinutos) * 60000);
  } else {
    return null;
  }
  return Number.isNaN(prazo.getTime()) ? null : prazo;
}

function atualizarContadoresTarefas() {
  const agoraData = new Date();
  const chaveDiaAtual = `${agoraData.getFullYear()}-${String(agoraData.getMonth() + 1).padStart(2, '0')}-${String(agoraData.getDate()).padStart(2, '0')}`;
  if (tarefasListaAtual.length && chaveDiaAtual !== chaveDiaTarefasRenderizadas) {
    const recorrentes = tarefasListaAtual.filter((item) => item.recorrencia?.ativa);
    const unicas = tarefasListaAtual.filter((item) => !item.recorrencia?.ativa);
    document.getElementById('lista-tarefas-recorrentes').innerHTML = renderizarCardsTarefas(recorrentes, true) || '<p class="empty-state">Nenhuma tarefa recorrente cadastrada.</p>';
    document.getElementById('lista-viagens').innerHTML = renderizarCardsTarefas(unicas) || '<p class="empty-state">Nenhuma ação cadastrada.</p>';
    chaveDiaTarefasRenderizadas = chaveDiaAtual;
  }
  let cicloAlterado = false;
  tarefasListaAtual.forEach((viagem) => {
    if (!viagem.recorrencia?.ativa) return;
    (viagem.tarefas || []).forEach((tarefa, indice) => {
      const checkbox = [...document.querySelectorAll('[data-tarefa-toggle]')].find((item) =>
        item.dataset.tarefaToggle === viagem.id && Number(item.dataset.tarefaIndex) === indice);
      if (checkbox && checkbox.checked !== tarefaConcluidaNoPeriodo(tarefa, viagem.recorrencia, viagem.criadoEm)) cicloAlterado = true;
    });
  });
  if (cicloAlterado) {
    const recorrentes = tarefasListaAtual.filter((item) => item.recorrencia?.ativa);
    const unicas = tarefasListaAtual.filter((item) => !item.recorrencia?.ativa);
    document.getElementById('lista-tarefas-recorrentes').innerHTML = renderizarCardsTarefas(recorrentes, true) || '<p class="empty-state">Nenhuma tarefa recorrente cadastrada.</p>';
    document.getElementById('lista-viagens').innerHTML = renderizarCardsTarefas(unicas) || '<p class="empty-state">Nenhuma ação cadastrada.</p>';
  }
  const agora = Date.now();
  document.querySelectorAll('[data-prazo-tarefa]').forEach((elemento) => {
    const prazo = new Date(elemento.dataset.prazoTarefa).getTime();
    if (!Number.isFinite(prazo)) return;
    const diferenca = prazo - agora;
    if (diferenca <= 0) {
      const atraso = Math.floor(Math.abs(diferenca) / 1000);
      const horas = String(Math.floor(atraso / 3600)).padStart(2, '0');
      const minutos = String(Math.floor((atraso % 3600) / 60)).padStart(2, '0');
      const segundos = String(atraso % 60).padStart(2, '0');
      elemento.textContent = `Você está em ${horas}:${minutos}:${segundos} atrasado`;
      elemento.classList.add('prazo-atrasado');
    } else {
      const restante = Math.floor(diferenca / 1000);
      const horas = String(Math.floor(restante / 3600)).padStart(2, '0');
      const minutos = String(Math.floor((restante % 3600) / 60)).padStart(2, '0');
      const segundos = String(restante % 60).padStart(2, '0');
      const prefixo = elemento.dataset.proximaTarefa === 'true' ? 'Próxima tarefa em' : 'Prazo em';
      elemento.textContent = `${prefixo} ${horas}:${minutos}:${segundos}`;
      elemento.classList.remove('prazo-atrasado');
    }
    if (diferenca <= 0) dispararAlertaPrazo(elemento.dataset.alertaTarefa);
  });
}

function dispararAlertaPrazo(chave) {
  if (!chave) return;
  const chaveStorage = `musicbox:alerta:${obterUsuarioTimerId()}:${chave}`;
  if (localStorage.getItem(chaveStorage)) return;
  localStorage.setItem(chaveStorage, '1');
  mostrarToast('Uma tarefa atingiu o prazo definido.', 'erro');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('MusicBox · prazo de tarefa', { body: 'Uma tarefa atingiu o horário limite.' });
  }
}

function renderizarCardsTarefas(lista, recorrentes = false) {
  const ordenadas = [...lista].sort((a, b) => Number(Boolean(b.fixada)) - Number(Boolean(a.fixada)) ||
    (converterDataReaudicao(b.atualizadoEm)?.getTime() || 0) - (converterDataReaudicao(a.atualizadoEm)?.getTime() || 0));
  return ordenadas.map((viagem) => {
    const recorrencia = viagem.recorrencia || null;
    const tarefas = Array.isArray(viagem.tarefas) && viagem.tarefas.length
      ? viagem.tarefas
      : [{ texto: viagem.titulo || 'Ação', concluida: Boolean(viagem.realizada) }];
    const concluida = tarefas.every((tarefa) => tarefaConcluidaNoPeriodo(tarefa, recorrencia, viagem.criadoEm));
    const unidadeIntervalo = recorrencia?.intervaloUnidade || 'dias';
    const valorIntervalo = Number(recorrencia?.intervaloValor ?? recorrencia?.intervaloDias) || 1;
    const configuracaoRecorrencia = recorrencia?.ativa
      ? `${recorrencia.frequencia === 'diaria' ? 'Diária' : recorrencia.frequencia === 'semanal' ? 'Semanal' : recorrencia.frequencia === 'mensal' ? `Todo dia ${recorrencia.diaMes} do mês` : recorrencia.frequencia === 'intervalo' ? `A cada ${valorIntervalo} ${unidadeIntervalo}` : 'Dias da semana'}${recorrencia.diasSemana?.length ? ` · ${recorrencia.diasSemana.map((dia) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dia]).join(', ')}` : ''}${recorrencia.horaLimite ? ` · às ${recorrencia.horaLimite}` : ''}`
      : '';
    return `
      <article class="viagem-card ${concluida ? 'viagem-feita' : ''} ${viagem.fixada ? 'tarefa-fixada' : ''} ${recorrentes ? 'tarefa-recorrente' : ''}">
        <div class="card-cabecalho">
          <h3>${viagem.fixada ? '📌 ' : ''}${escaparHtml(viagem.titulo || 'Ação')}</h3>
          <span class="badge-duracao ${concluida ? 'feito' : ''}">${concluida ? (recorrentes ? 'Concluída no período' : 'Concluída') : (recorrentes ? 'Recorrente' : 'Pendente')}</span>
        </div>
        ${configuracaoRecorrencia ? `<p class="viagem-status-data">${escaparHtml(configuracaoRecorrencia)}</p>` : ''}
        ${!recorrentes ? `<p class="viagem-status-data">${viagem.realizada ? `Realizada em: ${formatarDataHora(viagem.realizadaEm)}` : 'Ainda não marcada como concluída'}</p>` : ''}
        <div class="lista-tarefas-card">
          ${tarefas.map((tarefa, index) => {
            const feita = tarefaConcluidaNoPeriodo(tarefa, recorrencia, viagem.criadoEm);
            const prazo = obterPrazoTarefa(tarefa, viagem);
            const chaveAlerta = prazo ? `${viagem.id}-${index}-${prazo.toISOString()}` : '';
            const agendadaHoje = !recorrentes || recorrenciaAgendadaHoje(recorrencia);
            return `<div class="tarefa-com-prazo"><label class="viagem-status-row"><input type="checkbox" data-tarefa-toggle="${viagem.id}" data-tarefa-index="${index}" ${feita ? 'checked' : ''} ${agendadaHoje ? '' : 'disabled'}><span>${escaparHtml(tarefa.texto || `Tarefa ${index + 1}`)}</span></label>${prazo ? `<span class="tarefa-prazo" data-prazo-tarefa="${prazo.toISOString()}" data-proxima-tarefa="${recorrencia?.frequencia === 'intervalo'}" data-alerta-tarefa="${escaparHtml(chaveAlerta)}"></span>` : !agendadaHoje ? '<span class="tarefa-prazo">Fora do dia programado</span>' : ''}</div>`;
          }).join('')}
        </div>
        <div class="card-datas">Criado: ${formatarDataHora(viagem.criadoEm)}<br>Atualizado: ${formatarDataHora(viagem.atualizadoEm)}</div>
        <div class="card-acoes">
          <button type="button" class="btn-alerta" data-viagem-editar="${viagem.id}">Editar</button>
          <button type="button" class="btn-perigo" data-viagem-excluir="${viagem.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join('');
}

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
    tarefasListaAtual = lista;
    const agora = new Date();
    chaveDiaTarefasRenderizadas = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    const tarefasRecorrentes = lista.filter((item) => item.recorrencia?.ativa);
    const tarefasUnicas = lista.filter((item) => !item.recorrencia?.ativa);
    const containerRecorrentes = document.getElementById('lista-tarefas-recorrentes');
    const containerUnicas = document.getElementById('lista-viagens');
    if (containerRecorrentes) containerRecorrentes.innerHTML = renderizarCardsTarefas(tarefasRecorrentes, true) || '<p class="empty-state">Nenhuma tarefa recorrente cadastrada.</p>';
    if (containerUnicas) containerUnicas.innerHTML = renderizarCardsTarefas(tarefasUnicas) || '<p class="empty-state">Nenhuma ação cadastrada.</p>';
    atualizarContadoresTarefas();
  }, (erro) => {
    console.error('Erro ao carregar To Do Lists:', erro);
    const container = document.getElementById('lista-viagens');
    if (container) {
      container.innerHTML = '<p class="empty-state">Não foi possível carregar as tarefas. Tente atualizar a página.</p>';
    }
  });
}

if (!window.intervaloContadoresTarefas) {
  window.intervaloContadoresTarefas = window.setInterval(atualizarContadoresTarefas, 1000);
}

function atualizarCamposRecorrencia() {
  const recorrente = document.getElementById('viagem-recorrente').checked;
  const frequencia = document.getElementById('viagem-frequencia').value;
  document.getElementById('config-recorrencia').classList.toggle('escondido', !recorrente);
  document.getElementById('viagem-dias-semana').classList.toggle('escondido', !recorrente || !['dias-semana', 'semanal'].includes(frequencia));
  document.getElementById('grupo-intervalo-dias').classList.toggle('escondido', !recorrente || frequencia !== 'intervalo');
  document.getElementById('grupo-dia-mes').classList.toggle('escondido', !recorrente || frequencia !== 'mensal');
  document.getElementById('viagem-hora-limite').disabled = !recorrente || frequencia === 'intervalo';
}

document.getElementById('viagem-recorrente').addEventListener('change', atualizarCamposRecorrencia);
document.getElementById('viagem-frequencia').addEventListener('change', atualizarCamposRecorrencia);
document.getElementById('btn-ativar-notificacoes').addEventListener('click', async () => {
  if (!('Notification' in window)) return mostrarToast('Este navegador não oferece notificações.', 'erro');
  const permissao = await Notification.requestPermission();
  mostrarToast(permissao === 'granted' ? 'Alertas de prazo ativados.' : 'Permissão para notificações não concedida.', permissao === 'granted' ? 'sucesso' : 'erro');
});

document.getElementById('btn-nova-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
  document.querySelectorAll('#viagem-dias-semana input').forEach((item) => { item.checked = false; });
  atualizarCamposRecorrencia();
  controlarFormularioRecolhivel('form-viagem', true);
  document.getElementById('viagem-titulo').focus();
});

document.getElementById('btn-cancelar-viagem').addEventListener('click', () => {
  document.getElementById('form-viagem').reset();
  document.getElementById('viagem-id').value = '';
  atualizarCamposRecorrencia();
  controlarFormularioRecolhivel('form-viagem', false);
});

document.getElementById('form-viagem').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarUsuarioParaSalvar()) return;

  const usuarioAtivo = obterUsuarioAtivo();
  const id = document.getElementById('viagem-id').value;
  const titulo = document.getElementById('viagem-titulo').value.trim();
  const textosTarefas = document.getElementById('viagem-tarefas').value
    .split(';')
    .map((texto) => texto.trim())
    .filter(Boolean);
  const ehRecorrente = document.getElementById('viagem-recorrente').checked;
  const frequencia = document.getElementById('viagem-frequencia').value;
  const diasSemana = [...document.querySelectorAll('#viagem-dias-semana input:checked')].map((item) => Number(item.value));
  const horario = document.getElementById('viagem-hora-limite').value;
  const intervaloValor = Math.max(1, Number(document.getElementById('viagem-intervalo-dias').value) || 1);
  const intervaloUnidade = document.getElementById('viagem-intervalo-unidade').value;
  const diaMes = Math.min(31, Math.max(1, Number(document.getElementById('viagem-dia-mes').value) || 1));
  if (ehRecorrente && frequencia !== 'intervalo' && !horario) {
    return mostrarToast('Informe o horário da tarefa recorrente.', 'erro');
  }
  if (ehRecorrente && ['dias-semana', 'semanal'].includes(frequencia) && !diasSemana.length) {
    return mostrarToast('Selecione ao menos um dia para a tarefa recorrente.', 'erro');
  }
  if (ehRecorrente && frequencia === 'semanal' && diasSemana.length !== 1) {
    return mostrarToast('Selecione exatamente um dia para a recorrência semanal.', 'erro');
  }
  const recorrencia = ehRecorrente ? {
    ativa: true,
    frequencia,
    diasSemana: ['dias-semana', 'semanal'].includes(frequencia) ? diasSemana : [],
    intervaloValor: frequencia === 'intervalo' ? intervaloValor : null,
    intervaloUnidade: frequencia === 'intervalo' ? intervaloUnidade : null,
    diaMes: frequencia === 'mensal' ? diaMes : null,
    horaLimite: frequencia === 'intervalo' ? null : horario
  } : null;
  const fixada = document.getElementById('viagem-fixada').checked;

  if (!titulo) {
    return mostrarToast('Informe o nome da viagem.', 'erro');
  }

  try {
    if (id) {
      const viagemAnterior = (await getDoc(doc(db, 'viagens', id))).data() || {};
      const tarefasAntigas = Array.isArray(viagemAnterior.tarefas) ? viagemAnterior.tarefas : [];
      const tarefasAtualizadas = (textosTarefas.length ? textosTarefas : [titulo]).map((texto, index) => {
        const anterior = tarefasAntigas.find((tarefa) => tarefa.texto === texto) || tarefasAntigas[index] || {};
        return { ...anterior, texto, concluida: Boolean(anterior.concluida) };
      });
      await updateDoc(doc(db, 'viagens', id), {
        categoria: 'viagem',
        titulo,
        tarefas: tarefasAtualizadas,
        recorrencia,
        fixada,
        atualizadoEm: serverTimestamp()
      });
      mostrarToast('Viagem atualizada!');
    } else {
      await addDoc(collection(db, 'viagens'), {
        categoria: 'viagem',
        titulo,
        tarefas: (textosTarefas.length ? textosTarefas : [titulo]).map((texto) => ({ texto, concluida: false })),
        recorrencia,
        fixada,
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

['lista-viagens', 'lista-tarefas-recorrentes'].forEach((idLista) => document.getElementById(idLista).addEventListener('click', async (event) => {
  const editarId = event.target.closest('[data-viagem-editar]')?.dataset.viagemEditar;
  const excluirId = event.target.closest('[data-viagem-excluir]')?.dataset.viagemExcluir;

  if (editarId) {
    const docSnap = await getDoc(doc(db, 'viagens', editarId));
    const dados = docSnap.data();
    if (!dados) return;

    document.getElementById('viagem-id').value = editarId;
    document.getElementById('viagem-titulo').value = dados.titulo || '';
    document.getElementById('viagem-tarefas').value = (dados.tarefas || []).map((tarefa) => tarefa.texto).join('; ');
    document.getElementById('viagem-recorrente').checked = Boolean(dados.recorrencia?.ativa);
    document.getElementById('viagem-frequencia').value = dados.recorrencia?.frequencia || 'diaria';
    document.getElementById('viagem-intervalo-dias').value = dados.recorrencia?.intervaloValor || dados.recorrencia?.intervaloDias || 1;
    document.getElementById('viagem-intervalo-unidade').value = dados.recorrencia?.intervaloUnidade || 'dias';
    document.getElementById('viagem-dia-mes').value = dados.recorrencia?.diaMes || 21;
    document.getElementById('viagem-hora-limite').value = dados.recorrencia?.horaLimite || '';
    document.querySelectorAll('#viagem-dias-semana input').forEach((item) => { item.checked = (dados.recorrencia?.diasSemana || []).includes(Number(item.value)); });
    document.getElementById('viagem-fixada').checked = Boolean(dados.fixada);
    atualizarCamposRecorrencia();
    controlarFormularioRecolhivel('form-viagem', true);
    document.getElementById('viagem-titulo').focus();
  }

  if (excluirId) {
    if (confirm('Deseja excluir esta viagem?')) {
      await deleteDoc(doc(db, 'viagens', excluirId));
      mostrarToast('Viagem removida!');
    }
  }
}));

['lista-viagens', 'lista-tarefas-recorrentes'].forEach((idLista) => document.getElementById(idLista).addEventListener('change', async (event) => {
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
  const recorrencia = viagem.recorrencia || null;
  const marcarConcluida = checkbox.checked;
  tarefas[tarefaIndex].concluida = recorrencia?.frequencia === 'intervalo' ? false : marcarConcluida;
  if (recorrencia?.ativa) {
    tarefas[tarefaIndex].ultimaConclusaoEm = marcarConcluida ? new Date().toISOString() : null;
    tarefas[tarefaIndex].periodoConcluido = marcarConcluida ? chavePeriodoRecorrencia(recorrencia) : null;
  }
  if (recorrencia?.frequencia === 'intervalo') checkbox.checked = false;
  const todasConcluidas = tarefas.every((tarefa) => tarefaConcluidaNoPeriodo(tarefa, recorrencia, viagem.criadoEm));

  await updateDoc(doc(db, 'viagens', viagemId), {
    categoria: 'viagem',
    tarefas,
    realizada: todasConcluidas,
    realizadaEm: todasConcluidas ? serverTimestamp() : null,
    atualizadoEm: serverTimestamp()
  });

  mostrarToast(recorrencia?.frequencia === 'intervalo' && marcarConcluida
    ? 'Ciclo reiniciado. O próximo prazo já está contando.'
    : marcarConcluida ? 'Tarefa concluída!' : 'Tarefa reaberta.');
}));

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
    document.getElementById('album-subgenero').value = albumOriginal.subgenero || '';
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
      albumOriginal.faixas.forEach((faixa) => addLinhaFaixa(faixa.nome || '', faixa.classificacao || 'Boa', faixa));
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
  document.getElementById('album-subgenero').value = item.subgenero || '';
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
  (item.faixas || []).forEach((faixa) => addLinhaFaixa(faixa.nome || '', faixa.classificacao || 'Boa', faixa));
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

function addLinhaFaixa(nome = '', nota = 'Boa', opcoes = {}) {
  const div = document.createElement('div');
  div.className = 'linha-faixa';
  const nomeInicial = nome || `Faixa ${containerFaixas.children.length + 1}`;
  const downloadMarcado = Boolean(opcoes.baixar || opcoes.downloadUrl);
  const favoritaInicial = Boolean(opcoes.favorita) && !containerFaixas.querySelector('.faixa-favorita:checked');
  const ehNomePadrao = !nome || /^Faixa \d+$/.test(nomeInicial);
  div.dataset.nomePadrao = ehNomePadrao ? 'true' : 'false';
  div.innerHTML = `
    <input type="text" placeholder="Faixa ${containerFaixas.children.length + 1}" value="${escaparHtml(nomeInicial)}" class="faixa-nome" aria-label="Nome da faixa">
    <select class="faixa-nota">
      ${Object.keys(PESO_NOTAS).map(k => `<option value="${k}" ${k === nota ? 'selected' : ''}>${k} (${PESO_NOTAS[k]})</option>`).join('')}
    </select>
    <button type="button" onclick="removerLinhaFaixa(this)" class="btn-perigo" aria-label="Remover faixa">X</button>
    <div class="faixa-opcoes">
      <label><input type="checkbox" class="faixa-favorita" ${favoritaInicial ? 'checked' : ''}> Favorita</label>
      <label><input type="checkbox" class="faixa-desconsiderar" ${opcoes.desconsiderarMedia ? 'checked' : ''}> Desconsiderar da média</label>
      <label class="faixa-download-toggle">
        <input type="checkbox" class="faixa-download" ${downloadMarcado ? 'checked' : ''}>
        <span>Baixar música / Marcar para download</span>
      </label>
    </div>
  `;
  div.querySelector('.faixa-nome').addEventListener('input', (event) => {
    div.dataset.nomePadrao = event.target.value.trim() === '' || /^Faixa \d+$/.test(event.target.value.trim()) ? 'true' : 'false';
  });
  div.querySelector('.faixa-favorita').addEventListener('change', (event) => {
    if (event.target.checked) {
      containerFaixas.querySelectorAll('.faixa-favorita').forEach((checkbox) => {
        if (checkbox !== event.target) checkbox.checked = false;
      });
    }
  });
  containerFaixas.appendChild(div);
  div.addEventListener('input', atualizarNotaParcialAlbum);
  div.addEventListener('change', atualizarNotaParcialAlbum);
  atualizarNotaParcialAlbum();
}

function atualizarNotaParcialAlbum() {
  const linhasValidas = [...containerFaixas.querySelectorAll('.linha-faixa')]
    .filter((linha) => !linha.querySelector('.faixa-desconsiderar').checked);
  const soma = linhasValidas.reduce((total, linha) => total + (PESO_NOTAS[linha.querySelector('.faixa-nota').value] || 0), 0);
  const media = linhasValidas.length ? soma / linhasValidas.length : 0;
  const indicador = document.getElementById('nota-parcial-album');
  if (indicador) indicador.textContent = `Nota parcial: ${media.toFixed(1)} · ${linhasValidas.length} faixa(s)`;
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
  atualizarNotaParcialAlbum();
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
    const favoritaTexto = document.getElementById('album-favorita').value;
    const subgenero = document.getElementById('album-subgenero').value;
    const obs = document.getElementById('album-obs').value;
    const duracaoInformada = document.getElementById('album-duracao').value.trim();
    const duracao = timerAudicaoSegundos > 0 ? formatarDuracao(timerAudicaoSegundos) : duracaoInformada;
    const duracaoSegundos = timerAudicaoSegundos > 0
      ? timerAudicaoSegundos
      : converterDuracaoParaSegundos(duracaoInformada);

    const imagemFinal = imagemBase64Temp || urlImagemInput || '';
    const faixasInputs = document.querySelectorAll('.linha-faixa');
    let somaNotas = 0;
    let quantidadeFaixasValidas = 0;
    const faixas = [];

    faixasInputs.forEach((el, index) => {
      let fNome = el.querySelector('.faixa-nome').value.trim();
      const fNota = el.querySelector('.faixa-nota').value;
      if (!fNome) fNome = `Faixa ${index + 1}`;
      const desconsiderarMedia = el.querySelector('.faixa-desconsiderar').checked;
      const faixaFavorita = el.querySelector('.faixa-favorita').checked;
      const baixar = el.querySelector('.faixa-download').checked;
      if (!desconsiderarMedia) {
        somaNotas += PESO_NOTAS[fNota];
        quantidadeFaixasValidas += 1;
      }
      faixas.push({ nome: fNome, classificacao: fNota, favorita: faixaFavorita, desconsiderarMedia, baixar });
    });

    if (faixas.length === 0) {
      btnSalvar.disabled = false;
      btnSalvar.innerText = reaudicaoModoAtivo ? 'Salvar no Histórico' : 'Salvar Álbum';
      return mostrarToast("Adicione pelo menos uma faixa!", "erro");
    }

    const media = quantidadeFaixasValidas ? parseFloat((somaNotas / quantidadeFaixasValidas).toFixed(2)) : 0;
    const nmp = parseFloat(((media / 10) * 100).toFixed(1));
    const faixaFavorita = faixas.find((faixa) => faixa.favorita);
    const favorita = faixaFavorita?.nome || favoritaTexto;
    const faixaFavoritaNumero = faixaFavorita ? faixas.indexOf(faixaFavorita) + 1 : null;
    const agoraISO = new Date().toISOString();

    const salvandoReaudicao = reaudicaoModoAtivo;
    let idFirestoreCriado = null;
    const registroEmEdicao = reaudicaoEditandoId
      ? reaudicoesLista.find((item) => item.id === reaudicaoEditandoId)
      : null;
    if (salvandoReaudicao) {
      const registroHistorico = {
        nome, banda, ano, subgenero, imagem: imagemFinal, favorita, faixaFavoritaNumero, obs, faixas,
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
        nome, banda, ano, subgenero, imagem: imagemFinal, favorita, faixaFavoritaNumero, obs, faixas,
        media, somaNotas, nmp, duracao, duracaoSegundos, atualizadoEm: agoraISO
      };
      await updateDoc(doc(db, "albuns", id), updateData);
      mostrarToast("Álbum atualizado com sucesso!");
    } else {
      const idadeCadastro = calcularIdade(new Date());
      const novoData = {
        nome, banda, ano, subgenero, imagem: imagemFinal, favorita, faixaFavoritaNumero, obs, faixas,
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

    preencherAutocompleteBandas([
      ...snapshot.docs.map((docSnap) => docSnap.data().banda),
      ...documentosHistorico.map(({ data }) => data.bandaCaderno || data.nomeBanda || data.banda || data.artista)
    ]);

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

function preencherAutocompleteBandas(valores = []) {
  const datalist = document.getElementById('lista-bandas-autocomplete');
  if (!datalist) return;
  const bandas = [...new Set(valores.map((banda) => String(banda || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  datalist.innerHTML = bandas.map((banda) => `<option value="${escaparHtml(banda)}"></option>`).join('');
}

window.aplicarFiltrosEBuscar = function() {
  const termo = document.getElementById('filtro-busca').value.toLowerCase().trim();
  const anoFiltro = document.getElementById('filtro-ano').value;
  const ordem = document.getElementById('filtro-ordem').value;

  albunsFiltrados = todosOsAlbuns.filter(album => {
    const bateNome = (album.nome || '').toLowerCase().includes(termo);
    const bateBanda = (album.banda || '').toLowerCase().includes(termo);
    const bateSubgenero = (album.subgenero || '').toLowerCase().includes(termo);
    const bateAno = anoFiltro ? album.ano == anoFiltro : true;
    return (bateNome || bateBanda || bateSubgenero) && bateAno;
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
    const faixasParaBaixar = Array.isArray(data.faixas)
      ? data.faixas.reduce((indices, faixa, indice) => {
        if (faixa.baixar || faixa.downloadUrl) indices.push(indice + 1);
        return indices;
      }, [])
      : [];

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
      ${data.subgenero ? `<p><strong>Subgênero:</strong> ${escaparHtml(data.subgenero)}</p>` : ''}
      <p><strong>Faixas:</strong> ${Array.isArray(data.faixas) ? data.faixas.length : 0}</p>
      <p class="album-download-summary"><strong>Baixar faixas:</strong> ${faixasParaBaixar.length ? faixasParaBaixar.join(', ') : 'Nenhuma faixa marcada'}</p>
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
    document.getElementById('album-subgenero').value = data.subgenero || '';
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
    (data.faixas || []).forEach(f => addLinhaFaixa(f.nome, f.classificacao, f));
    if (!data.faixas?.length) addLinhaFaixa();

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

function filtrarRegistrosPorOrigem(registros, origem, unicos = true) {
  let filtrados = registros;
  if (origem === 'ineditos') filtrados = registros.filter((item) => !item.isReaudicao && !item.isCaderno);
  if (origem === 'caderno') filtrados = registros.filter((item) => item.isCaderno);
  if (origem === 'reaudicoes') filtrados = registros.filter((item) => item.isReaudicao);
  return unicos ? selecionarRegistrosUnicosPorAlbum(filtrados) : filtrados;
}

function desenharGraficoEvolucaoBanda() {
  const bandas = new Map();
  albunsEvolucaoDisponiveis.forEach((album) => {
    const ano = Number(album.ano);
    const nota = Number(album.media);
    if (!Number.isFinite(ano) || !Number.isFinite(nota)) return;
    const banda = String(album.banda || '').trim() || 'Desconhecida';
    const pontos = bandas.get(banda) || [];
    pontos.push({ x: ano, y: nota, album: album.nome || 'Álbum sem nome' });
    bandas.set(banda, pontos);
  });

  const entradas = [...bandas.entries()];
  const seletor = document.getElementById('filtro-banda-evolucao');
  const filtroGlobal = document.getElementById('filtro-banda-estatistica')?.value || '*';
  const bandaGlobal = filtroGlobal === '*' ? null : filtroGlobal;
  const bandasDisponiveis = bandaGlobal
    ? entradas.filter(([banda]) => banda === bandaGlobal)
    : entradas;

  if (bandaGlobal && bandasDisponiveis.length) {
    bandaEvolucaoSelecionada = bandaGlobal;
  } else if (bandaEvolucaoSelecionada !== '*' &&
    !bandasDisponiveis.some(([banda]) => banda === bandaEvolucaoSelecionada)) {
    if (bandasDisponiveis.length) {
      const indiceAleatorio = Math.floor(Math.random() * bandasDisponiveis.length);
      bandaEvolucaoSelecionada = bandasDisponiveis[indiceAleatorio]?.[0] || bandasDisponiveis[0][0];
    } else {
      bandaEvolucaoSelecionada = null;
    }
  }

  if (seletor) {
    seletor.innerHTML = bandasDisponiveis.length
      ? `<option value="*">Todas</option>${bandasDisponiveis.map(([banda]) =>
        `<option value="${escaparHtml(banda)}">${escaparHtml(banda)}</option>`
      ).join('')}`
      : '<option value="">Sem bandas com dados</option>';
    seletor.value = bandaEvolucaoSelecionada || '';
    seletor.disabled = Boolean(bandaGlobal) || !bandasDisponiveis.length;
  }

  const mostrandoTodas = bandaEvolucaoSelecionada === '*';
  const bandaEscolhida = bandasDisponiveis.find(([banda]) => banda === bandaEvolucaoSelecionada);
  const tituloEvolucao = document.getElementById('grafico-evolucao-banda-selecionada');
  if (tituloEvolucao) {
    tituloEvolucao.textContent = mostrandoTodas
      ? 'Todas as bandas'
      : bandaEscolhida?.[0] || 'Sem dados cadastrados';
  }

  if (graficoEvolucaoBandas) {
    graficoEvolucaoBandas.destroy();
    graficoEvolucaoBandas = null;
  }
  const canvas = document.getElementById('graficoEvolucaoBandas');
  if (!canvas || typeof Chart === 'undefined') return;

  const cores = ['#c19a5b', '#9a5149', '#a8a08f', '#75806d', '#8a7256', '#b66e4d', '#857c70', '#ad8350'];
  const series = mostrandoTodas
    ? bandasDisponiveis
    : bandaEscolhida ? [bandaEscolhida] : [];
  graficoEvolucaoBandas = new Chart(canvas.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: series.map(([banda, valores], indice) => ({
        label: banda,
        data: [...valores].sort((a, b) => a.x - b.x),
        showLine: true,
        borderColor: cores[indice % cores.length],
        backgroundColor: cores[indice % cores.length],
        pointRadius: 5,
        tension: 0.2
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label} · ${context.raw.album} · ${context.raw.x} · ${context.raw.y.toFixed(1)}`
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Ano de lançamento', color: '#b7b2a8' },
          ticks: { color: '#a7a094' },
          grid: { color: 'rgba(210, 195, 170, 0.08)' }
        },
        y: {
          min: 0,
          max: 10,
          title: { display: true, text: 'Nota média', color: '#b7b2a8' },
          ticks: { color: '#a7a094' },
          grid: { color: 'rgba(210, 195, 170, 0.08)' }
        }
      }
    }
  });
}

function renderizarGraficosEstatisticas(albuns, albunsTodasBandas = albuns, registrosAtividade = albuns) {
  renderizarPaginaRanking(albuns);
  albunsEvolucaoDisponiveis = albunsTodasBandas;
  desenharGraficoEvolucaoBanda();
  renderizarGraficoNotaAno(albuns);
  renderizarHeatmapAtividade(registrosAtividade);
  renderizarGraficoTendenciaTemporal(registrosAtividade);
  renderizarGraficoPosicaoFaixas(albuns);
}

function obterDataAtividade(album) {
  return converterDataReaudicao(
    album.dataReouvido || album.criadoEm || album.dataOriginal || album.atualizadoEm
  );
}

function chaveDataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function renderizarHeatmapAtividade(albuns) {
  const grade = document.getElementById('heatmap-atividade');
  if (!grade) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicio = new Date(hoje);
  inicio.setDate(inicio.getDate() - 364);
  inicio.setDate(inicio.getDate() - inicio.getDay());
  const inicioChave = chaveDataLocal(inicio);
  const hojeChave = chaveDataLocal(hoje);
  const contagemPorDia = new Map();
  albuns.forEach((album) => {
    const data = obterDataAtividade(album);
    if (!data) return;
    const chave = chaveDataLocal(data);
    if (chave < inicioChave || chave > hojeChave) return;
    contagemPorDia.set(chave, (contagemPorDia.get(chave) || 0) + 1);
  });

  const maximo = Math.max(0, ...contagemPorDia.values());
  const fragmento = document.createDocumentFragment();

  for (const data = new Date(inicio); data <= hoje; data.setDate(data.getDate() + 1)) {
    const chave = chaveDataLocal(data);
    const quantidade = contagemPorDia.get(chave) || 0;
    const nivel = quantidade
      ? Math.min(4, Math.max(1, Math.ceil((quantidade / maximo) * 4)))
      : 0;
    const quadrado = document.createElement('span');
    const dataLegivel = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(data);
    quadrado.className = `heatmap-dia heatmap-nivel-${nivel}`;
    quadrado.title = `${dataLegivel}: ${quantidade} ${quantidade === 1 ? 'registro' : 'registros'}`;
    quadrado.setAttribute('aria-label', quadrado.title);
    quadrado.setAttribute('role', 'img');
    fragmento.appendChild(quadrado);
  }

  grade.replaceChildren(fragmento);
}

function renderizarGraficoTendenciaTemporal(albuns) {
  if (graficoTendenciaTemporal) {
    graficoTendenciaTemporal.destroy();
    graficoTendenciaTemporal = null;
  }

  const canvas = document.getElementById('graficoTendenciaTemporal');
  const resumo = document.getElementById('resumo-tendencia-temporal');
  const meses = new Map();
  albuns.forEach((album) => {
    const data = obterDataAtividade(album);
    if (!data) return;
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    const periodo = meses.get(chave) || { ano: data.getFullYear(), mes: data.getMonth(), quantidade: 0, somaNotas: 0, quantidadeNotas: 0 };
    periodo.quantidade += 1;
    const nota = album.media === '' || album.media === null || album.media === undefined
      ? Number.NaN
      : Number(album.media);
    if (Number.isFinite(nota) && nota >= 0 && nota <= 10) {
      periodo.somaNotas += nota;
      periodo.quantidadeNotas += 1;
    }
    meses.set(chave, periodo);
  });

  const chavesOrdenadas = [...meses.keys()].sort();
  if (!chavesOrdenadas.length) {
    if (resumo) resumo.textContent = 'Ainda não há datas de avaliação disponíveis para calcular a tendência.';
    return;
  }

  const primeiro = meses.get(chavesOrdenadas[0]);
  const ultimo = meses.get(chavesOrdenadas[chavesOrdenadas.length - 1]);
  const inicio = new Date(primeiro.ano, primeiro.mes, 1);
  const fim = new Date(ultimo.ano, ultimo.mes, 1);
  const periodos = [];
  for (const data = new Date(inicio); data <= fim; data.setMonth(data.getMonth() + 1)) {
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    periodos.push(meses.get(chave) || {
      ano: data.getFullYear(),
      mes: data.getMonth(),
      quantidade: 0,
      somaNotas: 0,
      quantidadeNotas: 0
    });
  }

  const labels = periodos.map((periodo) =>
    new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })
      .format(new Date(periodo.ano, periodo.mes, 1))
  );
  const medias = periodos.map((periodo) =>
    periodo.quantidadeNotas ? periodo.somaNotas / periodo.quantidadeNotas : null
  );
  const pontosNota = medias
    .map((nota, indice) => nota === null ? null : { x: indice, y: nota })
    .filter(Boolean);

  let linhaTendencia = periodos.map(() => null);
  let variacaoTendencia = null;
  if (pontosNota.length >= 2) {
    const mediaX = pontosNota.reduce((total, ponto) => total + ponto.x, 0) / pontosNota.length;
    const mediaY = pontosNota.reduce((total, ponto) => total + ponto.y, 0) / pontosNota.length;
    const numerador = pontosNota.reduce((total, ponto) => total + (ponto.x - mediaX) * (ponto.y - mediaY), 0);
    const denominador = pontosNota.reduce((total, ponto) => total + (ponto.x - mediaX) ** 2, 0);
    const inclinacao = denominador ? numerador / denominador : 0;
    const intercepto = mediaY - inclinacao * mediaX;
    linhaTendencia = periodos.map((_, indice) => intercepto + inclinacao * indice);
    variacaoTendencia = linhaTendencia[linhaTendencia.length - 1] - linhaTendencia[0];
  }

  if (resumo) {
    if (variacaoTendencia === null) {
      resumo.textContent = 'São necessários ao menos dois períodos com notas para estimar uma tendência.';
    } else if (Math.abs(variacaoTendencia) < 0.05) {
      resumo.textContent = 'A tendência estimada das notas está estável no período selecionado.';
    } else {
      const direcao = variacaoTendencia > 0 ? 'subindo' : 'caindo';
      resumo.textContent = `A tendência estimada está ${direcao} ${Math.abs(variacaoTendencia).toFixed(2)} ponto(s) entre o início e o fim do período.`;
    }
  }
  if (!canvas || typeof Chart === 'undefined') return;

  graficoTendenciaTemporal = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Álbuns avaliados',
          data: periodos.map((periodo) => periodo.quantidade),
          yAxisID: 'yVolume',
          backgroundColor: 'rgba(182, 139, 82, 0.58)',
          borderColor: '#b68b52',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          type: 'line',
          label: 'Nota média',
          data: medias,
          yAxisID: 'yNotas',
          borderColor: '#f0d08b',
          backgroundColor: '#f0d08b',
          pointBackgroundColor: '#f0d08b',
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
          tension: 0.25,
          spanGaps: true
        },
        {
          type: 'line',
          label: 'Tendência das notas',
          data: linhaTendencia,
          yAxisID: 'yNotas',
          borderColor: '#c76d55',
          backgroundColor: '#c76d55',
          pointRadius: 0,
          borderWidth: 2,
          borderDash: [7, 5],
          tension: 0,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            title: (items) => items[0]?.label || '',
            label: (context) => {
              const valor = context.parsed.y;
              if (valor === null || valor === undefined) return `${context.dataset.label}: sem notas`;
              return context.dataset.yAxisID === 'yNotas'
                ? `${context.dataset.label}: ${valor.toFixed(2)}/10`
                : `${context.dataset.label}: ${valor}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#a7a094', maxTicksLimit: 14, maxRotation: 0 },
          grid: { display: false }
        },
        yVolume: {
          beginAtZero: true,
          title: { display: true, text: 'Álbuns', color: '#b7b2a8' },
          ticks: { color: '#a7a094', precision: 0 },
          grid: { color: 'rgba(210, 195, 170, 0.08)' }
        },
        yNotas: {
          position: 'right',
          min: 0,
          max: 10,
          title: { display: true, text: 'Nota média (0–10)', color: '#b7b2a8' },
          ticks: { color: '#a7a094', stepSize: 2 },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function renderizarGraficoPosicaoFaixas(albuns) {
  if (graficoPosicaoFaixas) {
    graficoPosicaoFaixas.destroy();
    graficoPosicaoFaixas = null;
  }

  const canvas = document.getElementById('graficoPosicaoFaixas');
  if (!canvas || typeof Chart === 'undefined') return;

  const contagem = { inicio: 0, meio: 0, fim: 0 };
  albuns.forEach((album) => {
    const faixas = Array.isArray(album.faixas) ? album.faixas : [];
    const posicao = Number(album.faixaFavoritaNumero) ||
      faixas.findIndex((faixa) => faixa.favorita) + 1;
    if (!faixas.length || posicao < 1 || posicao > faixas.length) return;
    const terco = Math.ceil(faixas.length / 3);
    if (posicao <= terco) contagem.inicio += 1;
    else if (posicao > faixas.length - terco) contagem.fim += 1;
    else contagem.meio += 1;
  });

  graficoPosicaoFaixas = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Início', 'Meio', 'Fim'],
      datasets: [{
        label: 'Faixas favoritas',
        data: [contagem.inicio, contagem.meio, contagem.fim],
        backgroundColor: ['rgba(182, 139, 82, 0.78)', 'rgba(193, 154, 91, 0.55)', 'rgba(199, 109, 85, 0.68)'],
        borderColor: ['#c19a5b', '#d2ad6d', '#c76d55'],
        borderWidth: 1,
        borderRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => `${context.parsed.y} álbum(ns)` } }
      },
      scales: {
        x: { ticks: { color: '#c9c2b5' }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: '#a7a094', precision: 0 },
          grid: { color: 'rgba(210, 195, 170, 0.08)' }
        }
      }
    }
  });
}

function renderizarGraficoNotaAno(albuns) {
  if (graficoNotaAno) {
    graficoNotaAno.destroy();
    graficoNotaAno = null;
  }

  const canvas = document.getElementById('graficoNotaAno');
  if (!canvas || typeof Chart === 'undefined') return;

  const dados = albuns
    .map((album) => {
      const nota = album.media === '' || album.media === null || album.media === undefined
        ? Number.NaN
        : Number(album.media);
      return {
        ano: Number(album.ano),
        nota,
        nome: album.nome || 'Álbum sem nome',
        banda: String(album.banda || '').trim() || 'Banda desconhecida'
      };
    })
    .filter((album) => Number.isFinite(album.ano) && album.ano > 0 && Number.isFinite(album.nota))
    .sort((a, b) => a.ano - b.ano);
  const anos = dados.map((album) => album.ano);
  const menorAno = anos.length ? Math.min(...anos) : 1900;
  const maiorAno = anos.length ? Math.max(...anos) : 2100;

  graficoNotaAno = new Chart(canvas.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Nota Média do Álbum',
        data: dados.map((album) => ({
          x: album.ano,
          y: album.nota,
          album: album.nome,
          banda: album.banda,
          ano: album.ano,
          nota: album.nota
        })),
        showLine: true,
        borderColor: '#c19a5b',
        backgroundColor: 'rgba(193, 154, 91, 0.18)',
        borderWidth: 1,
        tension: 0.18,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: '#d8b576',
        pointBorderColor: '#f0e9dc',
        pointBorderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { labels: { color: '#c9c2b5' } },
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
          min: menorAno - 1,
          max: maiorAno + 1,
          title: { display: true, text: 'Ano de lançamento', color: '#d1c5ae' },
          ticks: {
            color: '#c2b59d',
            autoSkip: true,
            maxTicksLimit: 12,
            maxRotation: 0,
            callback: (value) => Number.isInteger(Number(value)) ? String(value) : ''
          },
          grid: { color: 'rgba(210, 195, 170, 0.1)' },
          border: { color: 'rgba(210, 195, 170, 0.25)' }
        },
        y: {
          min: -1,
          max: 10,
          title: { display: true, text: 'Nota média', color: '#d1c5ae' },
          ticks: { color: '#c2b59d', stepSize: 1, maxTicksLimit: 12 },
          grid: { color: 'rgba(210, 195, 170, 0.1)' },
          border: { color: 'rgba(210, 195, 170, 0.25)' }
        }
      }
    }
  });
}

function renderizarPaginaRanking(albuns) {
  const ranking = document.getElementById('ranking-albuns');
  const paginacao = document.getElementById('paginacao-ranking');
  const infoPagina = document.getElementById('ranking-pagina-info');
  const botaoAnterior = document.getElementById('ranking-anterior');
  const botaoProxima = document.getElementById('ranking-proxima');
  if (!ranking) return;

  const ordenados = [...albuns].sort((a, b) => Number(b.media || 0) - Number(a.media || 0));
  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / ALBUNS_POR_PAGINA_RANKING));
  paginaRankingAtual = Math.min(Math.max(1, paginaRankingAtual), totalPaginas);
  const inicio = (paginaRankingAtual - 1) * ALBUNS_POR_PAGINA_RANKING;
  const pagina = ordenados.slice(inicio, inicio + ALBUNS_POR_PAGINA_RANKING);

  ranking.innerHTML = pagina.length ? pagina.map((album, indice) => `
    <li value="${inicio + indice + 1}"><span>${escaparHtml(album.nome || 'Álbum sem nome')} <small>${escaparHtml(album.banda || '')}</small></span><strong>${Number(album.media || 0).toFixed(1)}</strong></li>
  `).join('') : '<li class="empty-state">Sem avaliações para ranquear.</li>';

  if (infoPagina) infoPagina.textContent = `Página ${paginaRankingAtual} de ${totalPaginas}`;
  if (botaoAnterior) botaoAnterior.disabled = paginaRankingAtual <= 1;
  if (botaoProxima) botaoProxima.disabled = paginaRankingAtual >= totalPaginas;
  if (paginacao) paginacao.classList.toggle('escondido', ordenados.length <= ALBUNS_POR_PAGINA_RANKING);
}

function obterAlbunsSelecionadosEstatisticas() {
  const filtro = document.getElementById('filtro-tipo-estatistica').value;
  const banda = document.getElementById('filtro-banda-estatistica').value;
  let albuns = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro);
  if (banda && banda !== '*') {
    albuns = albuns.filter((album) => (String(album.banda || '').trim() || 'Desconhecida') === banda);
  }
  return albuns;
}

function atualizarSeletorBandaEstatisticas(albuns) {
  const seletor = document.getElementById('filtro-banda-estatistica');
  if (!seletor) return '*';

  const contagem = new Map();
  albuns.forEach((album) => {
    const banda = String(album.banda || '').trim() || 'Desconhecida';
    contagem.set(banda, (contagem.get(banda) || 0) + 1);
  });
  const bandas = [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'));
  const valorAnterior = seletor.value;
  const valorPadrao = '*';

  seletor.innerHTML = [
    `<option value="*">Todas as bandas (${albuns.length})</option>`,
    ...bandas.map(([banda, total]) => `<option value="${escaparHtml(banda)}">${escaparHtml(banda)} (${total})</option>`)
  ].join('');
  seletor.value = valorAnterior === '*' || contagem.has(valorAnterior) ? valorAnterior : valorPadrao;
  if (!seletor.value) seletor.value = valorPadrao;
  return seletor.value || '*';
}

function atualizarMetricasBandas(albunsFiltrados) {
  const bandasPorNota = new Map();
  albunsFiltrados.forEach((album) => {
    const banda = String(album.banda || 'Desconhecida').trim();
    const valores = bandasPorNota.get(banda) || { soma: 0, quantidade: 0 };
    valores.soma += Number(album.media || 0);
    valores.quantidade += 1;
    bandasPorNota.set(banda, valores);
  });
  const favorita = [...bandasPorNota.entries()].map(([banda, dados]) => ({ banda, media: dados.soma / dados.quantidade }))
    .sort((a, b) => b.media - a.media)[0];
  const reproducoes = new Map();
  albunsFiltrados.forEach((registro) => {
    const banda = String(registro.banda || 'Desconhecida').trim();
    reproducoes.set(banda, (reproducoes.get(banda) || 0) + 1);
  });
  const maisOuvida = [...reproducoes.entries()].sort((a, b) => b[1] - a[1])[0];
  const reaudicoes = new Map();
  albunsFiltrados.filter((registro) => registro.isReaudicao && !registro.isCaderno).forEach((registro) => {
    const banda = String(registro.banda || 'Desconhecida').trim();
    reaudicoes.set(banda, (reaudicoes.get(banda) || 0) + 1);
  });
  const maisReouvida = [...reaudicoes.entries()].sort((a, b) => b[1] - a[1])[0];
  const posicoesFavoritas = new Map();
  albunsFiltrados.forEach((album) => {
    const posicao = Number(album.faixaFavoritaNumero) || (Array.isArray(album.faixas) ? album.faixas.findIndex((faixa) => faixa.favorita) + 1 : 0);
    if (posicao > 0) posicoesFavoritas.set(posicao, (posicoesFavoritas.get(posicao) || 0) + 1);
  });
  const faixaMaisEscolhida = [...posicoesFavoritas.entries()].sort((a, b) => b[1] - a[1])[0];
  document.getElementById('stat-banda-top').textContent = favorita ? `${favorita.banda} (${favorita.media.toFixed(2)}/10)` : '-';
  document.getElementById('stat-banda-mais-ouvida').textContent = maisOuvida ? `${maisOuvida[0]} (${maisOuvida[1]} audições)` : '-';
  document.getElementById('stat-banda-reaudicoes').textContent = maisReouvida ? `${maisReouvida[0]} (${maisReouvida[1]} ré-audições)` : '-';
  document.getElementById('stat-faixa-favorita').textContent = faixaMaisEscolhida ? `Faixa ${faixaMaisEscolhida[0]} (${faixaMaisEscolhida[1]} vezes)` : '-';
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

document.getElementById('filtro-tipo-estatistica').addEventListener('change', () => {
  paginaRankingAtual = 1;
  paginaTimelineAtual = 1;
  carregarEstatisticas(true);
});
document.getElementById('filtro-banda-estatistica').addEventListener('change', () => {
  paginaRankingAtual = 1;
  paginaTimelineAtual = 1;
  carregarEstatisticas(false);
});
document.getElementById('filtro-banda-evolucao').addEventListener('change', (evento) => {
  bandaEvolucaoSelecionada = evento.target.value || null;
  desenharGraficoEvolucaoBanda();
});
document.getElementById('ranking-anterior').addEventListener('click', () => {
  paginaRankingAtual = Math.max(1, paginaRankingAtual - 1);
  renderizarPaginaRanking(obterAlbunsSelecionadosEstatisticas());
});
document.getElementById('ranking-proxima').addEventListener('click', () => {
  paginaRankingAtual += 1;
  renderizarPaginaRanking(obterAlbunsSelecionadosEstatisticas());
});
document.getElementById('timeline-anterior').addEventListener('click', () => {
  paginaTimelineAtual = Math.max(1, paginaTimelineAtual - 1);
  const filtro = document.getElementById('filtro-tipo-estatistica').value;
  let base = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro, false);
  const banda = document.getElementById('filtro-banda-estatistica').value;
  if (banda && banda !== '*') base = base.filter((album) => (String(album.banda || '').trim() || 'Desconhecida') === banda);
  carregarTimeline(base);
});
document.getElementById('timeline-proxima').addEventListener('click', () => {
  paginaTimelineAtual += 1;
  const filtro = document.getElementById('filtro-tipo-estatistica').value;
  let base = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro, false);
  const banda = document.getElementById('filtro-banda-estatistica').value;
  if (banda && banda !== '*') base = base.filter((album) => (String(album.banda || '').trim() || 'Desconhecida') === banda);
  carregarTimeline(base);
});

// ESTATÍSTICAS
async function carregarEstatisticas(recarregarDados = true) {
  if (recarregarDados) {
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
  }
  const filtro = document.getElementById('filtro-tipo-estatistica').value;
  const albunsTodasBandas = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro);
  const bandaSelecionada = atualizarSeletorBandaEstatisticas(albunsTodasBandas);
  const albuns = bandaSelecionada === '*'
    ? albunsTodasBandas
    : albunsTodasBandas.filter((album) => (String(album.banda || '').trim() || 'Desconhecida') === bandaSelecionada);
  let registrosAtividade = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro, false);
  if (bandaSelecionada !== '*') {
    registrosAtividade = registrosAtividade.filter((album) =>
      (String(album.banda || '').trim() || 'Desconhecida') === bandaSelecionada
    );
  }
  renderizarGraficosEstatisticas(albuns, albunsTodasBandas, registrosAtividade);
  atualizarMetricasBandas(albuns);

  document.getElementById('stat-total').innerText = albuns.length;

  if (albuns.length === 0) {
    document.getElementById('stat-melhor').innerText = '-';
    document.getElementById('stat-pior').innerText = '-';
    document.getElementById('stat-banda-top').innerText = '-';
    document.getElementById('stat-banda-mais-ouvida').innerText = '-';
    document.getElementById('stat-banda-reaudicoes').innerText = '-';
    document.getElementById('stat-faixa-favorita').innerText = '-';
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
    carregarTimeline([]);
    return;
  }

  atualizarMetricasAudicao(albuns);

  const albunsPorNota = [...albuns].sort((a, b) => b.media - a.media);
  document.getElementById('stat-melhor').innerText = `${albunsPorNota[0].nome} (${albunsPorNota[0].media})`;
  document.getElementById('stat-pior').innerText = `${albunsPorNota[albunsPorNota.length - 1].nome} (${albunsPorNota[albunsPorNota.length - 1].media})`;

  const contagemBandas = new Map();
  albuns.forEach(a => {
    const b = String(a.banda || '').trim() || 'Desconhecida';
    contagemBandas.set(b, (contagemBandas.get(b) || 0) + 1);
  });
  document.getElementById('stat-bandas-diferentes').innerText = new Set(
    albuns.map((album) => (String(album.banda || '').trim() || 'Desconhecida'))
  ).size;

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
    const ano = Number(a.ano);
    const nota = Number(a.media);
    if (Number.isFinite(ano) && ano > 0) {
      const decada = Math.floor(ano / 10) * 10;
      if (!decadas[decada]) decadas[decada] = { soma: 0, qtdNotas: 0, totalAlbuns: 0 };
      decadas[decada].totalAlbuns += 1;
      if (Number.isFinite(nota) && nota >= 0 && nota <= 10) {
        decadas[decada].soma += nota;
        decadas[decada].qtdNotas += 1;
      }
    }
  });

  let decadaMaiorMedia = '-';
  let maiorMedia = 0;
  let decadaMaisQtd = '-';
  let maiorQtd = 0;

  const labelsDecadas = Object.keys(decadas).sort((a, b) => Number(a) - Number(b));
  labelsDecadas.forEach((d) => {
    const qtd = decadas[d].qtdNotas;
    const totalAlbuns = decadas[d].totalAlbuns;

    if (totalAlbuns > maiorQtd) {
      maiorQtd = totalAlbuns;
      decadaMaisQtd = `${d}s (${totalAlbuns} álbuns)`;
    }
    if (!qtd) return;

    const media = parseFloat((decadas[d].soma / qtd).toFixed(2));

    if (decadaMaiorMedia === '-' || media > maiorMedia) {
      maiorMedia = media;
      decadaMaiorMedia = `${d}s (${media} de média)`;
    }

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

  const bandasResumo = [...contagemBandas.entries()].map(([banda, quantidade]) => {
    const albunsDaBanda = albuns.filter(album => ((album.banda || '').trim() || 'Desconhecida') === banda);
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
  document.getElementById('stat-banda-pior').innerText = bandaPior ? `${bandaPior.banda} (${bandaPior.media.toFixed(2)}/10)` : '-';

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
  let registrosTimeline = filtrarRegistrosPorOrigem(registrosEstatisticas, filtro, false);
  if (bandaSelecionada !== '*') {
    registrosTimeline = registrosTimeline.filter((album) =>
      (String(album.banda || '').trim() || 'Desconhecida') === bandaSelecionada
    );
  }
  carregarTimeline(registrosTimeline);
}

// Timeline de histórico
function carregarTimeline(albuns) {
  const timelineContainer = document.getElementById('timeline-albuns');
  const paginacao = document.getElementById('paginacao-timeline');
  const infoPagina = document.getElementById('timeline-pagina-info');
  const botaoAnterior = document.getElementById('timeline-anterior');
  const botaoProxima = document.getElementById('timeline-proxima');
  if (!timelineContainer) return;

  const timestampDoAlbum = (album) => converterDataReaudicao(album.criadoEm)?.getTime() || 0;
  const todosAlbunsPorData = [...albuns].sort((a, b) => timestampDoAlbum(b) - timestampDoAlbum(a));
  const totalPaginas = Math.max(1, Math.ceil(todosAlbunsPorData.length / ALBUNS_POR_PAGINA_TIMELINE));
  paginaTimelineAtual = Math.min(Math.max(1, paginaTimelineAtual), totalPaginas);
  const inicio = (paginaTimelineAtual - 1) * ALBUNS_POR_PAGINA_TIMELINE;
  const albunsPorData = todosAlbunsPorData.slice(inicio, inicio + ALBUNS_POR_PAGINA_TIMELINE);

  if (albunsPorData.length === 0) {
    timelineContainer.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">Nenhum álbum adicionado ainda.</p>';
  } else {
    timelineContainer.innerHTML = albunsPorData.map(album => {
      const data = converterDataReaudicao(album.criadoEm);
      const dataFormatada = data
        ? data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Data não informada';
      return `
        <div class="timeline-item" onclick="navegarPara('sec-dashboard')">
          <div class="timeline-item-time">${escaparHtml(dataFormatada)}</div>
          <div class="timeline-item-content">
            <div class="timeline-item-title">${escaparHtml(album.nome || 'Álbum sem nome')}</div>
            <div class="timeline-item-banda">${escaparHtml(album.banda || 'Artista desconhecido')}</div>
            <div class="timeline-item-nota">${Number(album.media || 0).toFixed(1)} / 10</div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (infoPagina) infoPagina.textContent = `Página ${paginaTimelineAtual} de ${totalPaginas}`;
  if (botaoAnterior) botaoAnterior.disabled = paginaTimelineAtual <= 1;
  if (botaoProxima) botaoProxima.disabled = paginaTimelineAtual >= totalPaginas;
  if (paginacao) paginacao.classList.toggle('escondido', todosAlbunsPorData.length <= ALBUNS_POR_PAGINA_TIMELINE);
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