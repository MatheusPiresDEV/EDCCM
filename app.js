import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, getDoc 
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
  'assets/paisagem1.jpg',
  'assets/paisagem2.jpg',
  'assets/paisagem3.jpg',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
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
  document.getElementById('lockscreen').classList.add('deslizar-up');
};

window.bloquearTela = function() {
  sortearFraseELockscreen();
  document.getElementById('lockscreen').classList.remove('deslizar-up');
};

function sortearFraseELockscreen() {
  const f = FRASES[Math.floor(Math.random() * FRASES.length)];
  document.getElementById('lock-quote-texto').innerText = `"${f.quote}"`;
  document.getElementById('lock-quote-autor').innerText = `- ${f.autor}`;

  const img = IMAGENS_LOCKSCREEN[Math.floor(Math.random() * IMAGENS_LOCKSCREEN.length)];
  document.getElementById('lockscreen').style.backgroundImage = `url('${img}')`;
}
sortearFraseELockscreen();

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
const particulas = Array.from({ length: 60 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  raio: Math.random() * 2 + 1,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5
}));

function animarFundo() {
  const hora = new Date().getHours();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let corFundo1, corFundo2, corParticula;

  // Três horários: Manhã (6h-12h), Tarde (12h-18h), Noite (18h-6h)
  if (hora >= 6 && hora < 12) {
    // Manhã (Amanhecer Dourado / Azul Claro)
    corFundo1 = "#1e3c72";
    corFundo2 = "#2a5298";
    corParticula = "rgba(255, 223, 186, 0.6)";
  } else if (hora >= 12 && hora < 18) {
    // Tarde (Pôr do Sol Roxo / Laranja)
    corFundo1 = "#2c3e50";
    corFundo2 = "#fd746c";
    corParticula = "rgba(255, 255, 255, 0.5)";
  } else {
    // Noite (Céu Noturno Estrelado Profundo)
    corFundo1 = "#0f2027";
    corFundo2 = "#203a43";
    corParticula = "rgba(29, 185, 84, 0.7)";
  }

  // Gradiente de Fundo Reativo ao Mouse
  const gradiente = ctx.createRadialGradient(
    mouse.x, mouse.y, 100, 
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  gradiente.addColorStop(0, corFundo2);
  gradiente.addColorStop(1, corFundo1);

  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Renderiza Partículas Interativas
  particulas.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
    ctx.fillStyle = corParticula;
    ctx.fill();
  });

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

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

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

  if (navMenu && menuToggle) {
    navMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

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
  if (user) {
    usuarioAtual = user;
    document.getElementById('main-header').classList.remove('escondido');
    desbloquearTela();
    navegarPara('sec-dashboard');
  } else {
    usuarioAtual = null;
    document.getElementById('main-header').classList.add('escondido');
    navegarPara('sec-auth');
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
const wallpapers = [
    'assets/images (2).jfif',
    // 'assets/bg2.jpg',
    // 'assets/bg3.jpg'
];

let indiceWallpaperAtual = 0;

// Função para mudar wallpaper
function proximoWallpaper() {
    // Incrementa e reseta para 0 ao atingir o tamanho do array (loop infinito)
    indiceWallpaperAtual = (indiceWallpaperAtual + 1) % wallpapers.length;
    
    const bgContainer = document.getElementById('wallpaper-container');
    if (bgContainer) {
        bgContainer.style.backgroundImage = `url('${wallpapers[indiceWallpaperAtual]}')`;
    }
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