# 🎵 EDCCM - MusicBox & Personal Life Organizer

Uma aplicação web interativa, moderna e responsiva para **avaliação detalhada de álbuns musicais**, acompanhada de um painel estatístico e organizador pessoal. O projeto conta com design **Glassmorphism**, fundo canvas reativo, tela de bloqueio dinâmica (Lockscreen estilo Windows) e integração em tempo real com o **Firebase Firestore**.

🚀 **Acesse o projeto online:** [https://matheuspiresdev.github.io/EDCCM/](https://matheuspiresdev.github.io/EDCCM/)

---

## 🌟 Principais Funcionalidades

### 🎧 1. Avaliação e Gestão de Álbuns
- **Cadastro Detalhado:** Registro de nome, artista/banda, ano de lançamento, subgênero, capa (upload ou URL), música favorita e observações gerais.
- **Busca de Metadados:** Autocomplete opcional pelo iTunes Search com até 200 resultados para ampliar a cobertura de discografias e preencher artista, álbum, ano e capa em alta resolução; quando a API disponibiliza as faixas, a duração total também é calculada. Os campos continuam editáveis.
- **Widget de Aniversário:** Integrado ao painel de Estatísticas, exibe idade, progresso anual violeta e contagem regressiva; no dia 12 de novembro ativa o tema de aniversário, a supernova no canvas e uma chuva discreta de palhetas.
- **Sistema de Faixas e Notas:** Adição dinâmica de faixas com notas individuais e cálculo automático da média do álbum.
- **Busca e Filtros Avançados:** Filtre seus álbuns por nome, artista, ano ou ordene por mais recentes, melhores/piores notas e ano de lançamento.
- **Paginação:** Exibição fluida em grade responsiva com paginação.

### 📊 2. Painel de Estatísticas
- **Métricas em Tempo Real:** Total de álbuns, melhor e pior álbum, banda mais ouvida, década com maior média, dia mais ativo e tempo desde a última adição.
- **Gráficos Dinâmicos (Chart.js):**
  - Média de notas por década de lançamento.
  - Linha de correlação entre Nota Média x Ano de Lançamento de todos os álbuns.
  - Volume de audições e evolução temporal da nota média, com linha de tendência.
  - Contagem das posições exatas das faixas favoritas (Faixa 1, Faixa 2 e assim por diante).
- **Mapa de Atividade:** Heatmap dos últimos 12 meses com intensidade diária e tooltip de quantidade de registros.
- **Layout de Estatísticas:** Métricas e gráficos dispostos em coluna única para facilitar a leitura.
- **Backup CSV:** Exporta somente Álbum, Artista, Nota, Data Adicionada, Última Modificação e Faixa Favorita; usa `;` como delimitador, BOM UTF-8 e apenas o número ordinal da faixa.
- **Painel Admin:** Mostra e-mails únicos, média/distribuição das notas e a auditoria de e-mail, acesso, criação e modificação de cada conta.
- **Uso estimado do Firestore:** Soma o tamanho UTF-8 do JSON dos documentos em `albuns`, `usuarios`, `viagens`, `quadrinhos`, `historico_reaudicoes` e `reaudicoes`, exibindo MB, percentual do limite de referência de 1024 MB e espaço restante. É uma aproximação do payload: não representa a métrica física faturável do Firestore nem inclui subcoleções, índices, metadados e overhead interno.
- **CRUD de usuários:** Criação, edição de e-mail/senha/perfil e exclusão via Cloud Function com Firebase Admin SDK; a conta principal permanece imune a exclusão e rebaixamento.
- **Dados privados:** O widget de aniversário só é exibido para a conta principal de administrador.

### 🔒 3. Lockscreen & Autenticação (Estilo Windows)
- **Tela de Bloqueio Interativa:** Relógio digital em tempo real, data formatada, citações musicais inspiradoras e **saudação dinâmica** (Bom dia ☀️, Boa tarde 🌤️, Boa noite 🌙).
- **Autenticação Firebase:** Login e cadastro seguro por e-mail/senha com persistência de sessão por usuário (`userId`).

### 📌 4. Módulos Adicionais (Organizador Pessoal)
- **Top 5:** Tabelas personalizadas de Top 5 com temas customizáveis, histórico de alterações e logs de edição.
- **Viagens (To-Do List):** Lista de tarefas de viagens com rastreamento do tempo decorrido entre criação e conclusão.
- **Observações:** Bloco de notas rápido no estilo glassmorphism com suporte a histórico e logs de modificação.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Layout responsivo, CSS Grid, Flexbox, variáveis CSS e efeitos de Glassmorphism.
- **JavaScript (ES6+):** Programação assíncrona, manipulação do DOM e lógica de estatísticas.
- **Firebase / Firestore:** Banco de dados NoSQL em tempo real e autenticação de usuários.
- **Firebase Cloud Functions:** Operações administrativas privilegiadas de Authentication realizadas no backend.
- **Chart.js:** Renderização de gráficos interativos e responsivos.
- **GitHub Pages:** Hospedagem e deploy contínuo da aplicação.

---

## 📂 Estrutura do Projeto

```text
EDCCM/
├── assets/             # Imagens, ícones e wallpapers de fundo
├── index.html          # Estrutura principal e modais da aplicação
├── style.css          # Estilização global, temas e responsividade
├── app.js             # Lógica principal, integração Firebase e Chart.js
├── firestore.rules    # Regras de acesso do Firestore
├── firebase.json      # Configuração de deploy do Firebase
├── functions/         # Cloud Functions do painel administrativo
├── package.json       # Configurações do projeto Node/NPM
└── README.md          # Documentação do projeto
```

O uso estimado é atualizado toda vez que o painel administrativo carrega. Como a leitura varre integralmente as seis coleções listadas, ela gera leituras de documentos no Firestore; para bases grandes, prefira uma métrica agregada no backend.

### Deploy das operações administrativas

Configure o Firebase CLI para o projeto correto e use um plano Firebase que permita Cloud Functions. Depois, instale as dependências em `functions/` e publique as funções e regras:

```sh
cd functions
npm install
cd ..
firebase deploy --only functions,firestore:rules
