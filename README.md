# 🎵 EDCCM - MusicBox & Personal Life Organizer

Uma aplicação web interativa, moderna e responsiva para **avaliação detalhada de álbuns musicais**, acompanhada de um painel estatístico e organizador pessoal. O projeto conta com design **Glassmorphism**, fundo canvas reativo, tela de bloqueio dinâmica (Lockscreen estilo Windows) e integração em tempo real com o **Firebase Firestore**.

🚀 **Acesse o projeto online:** [https://matheuspiresdev.github.io/EDCCM/](https://matheuspiresdev.github.io/EDCCM/)

---

## 🌟 Principais Funcionalidades

### 🎧 1. Avaliação e Gestão de Álbuns
- **Cadastro Detalhado:** Registro de nome, artista/banda, ano de lançamento, capa (upload ou URL), música favorita e observações gerais.
- **Sistema de Faixas e Notas:** Adição dinâmica de faixas com notas individuais e cálculo automático da média do álbum.
- **Busca e Filtros Avançados:** Filtre seus álbuns por nome, artista, ano ou ordene por mais recentes, melhores/piores notas e ano de lançamento.
- **Paginação:** Exibição fluida em grade responsiva com paginação.

### 📊 2. Painel de Estatísticas
- **Métricas em Tempo Real:** Total de álbuns, melhor e pior álbum, banda mais ouvida, década com maior média, dia mais ativo e tempo desde a última adição.
- **Gráficos Dinâmicos (Chart.js):**
  - Média de notas por década de lançamento.
  - Linha de correlação entre Nota Média x Ano de Lançamento de todos os álbuns.

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
├── package.json       # Configurações do projeto Node/NPM
└── README.md          # Documentação do projeto
