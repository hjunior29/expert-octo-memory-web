# 🧠 Expert Octo Memory Web

Bem-vindo ao repositório **Expert Octo Memory Web**! Este projeto é uma aplicação web moderna, construída com 💨 **Svelte**, ⚡ **Bun** como engine JavaScript, e 🗾 **TypeScript**. Ele visa explorar tecnologias leves e performáticas para construção de interfaces interativas. O projeto tem como objetivo facilitar o estudo por meio de flashcard utilizando Inteligência Artificial.

O Projeto pode ser acessada via o link(caso ainda esteja em produção): [OCTO](https://expert-octo-memory.fly.dev/)


---

## 🏗️ Arquitetura do Projeto

A estrutura do projeto é organizada para facilitar o desenvolvimento e a escalabilidade:

```
expert-octo-memory-web/
├── .github/workflows/           # CI com GitHub Actions
├── src/                         # Código-fonte principal
│   ├── lib/                     # Biblioteca com utilitários, modelos e componentes
│   │   ├── components/custom/   # Componentes reutilizáveis personalizados
│   │   ├── models/              # Tipagens e modelos TypeScript
│   │   ├── static/images/       # Imagens usadas no projeto
│   │   └── utils.ts             # Funções utilitárias
│   │
│   └── routes/                  # Rotas da aplicação (páginas SvelteKit)
│       ├── (private)/           # Rotas protegidas (necessitam autenticação)
│       │   └── folder/++
│       ├── (public)/            # Rotas públicas (sem necessidade de autenticação)
│       │   ├── login/
│       │   └── register/
│       ├── +error.svelte        # Página de erro padrão
│       ├── +layout.svelte       # Layout raiz
│       └── +layout.ts           # Lógica do layout (load, auth, etc.)
├── static/                      # Arquivos públicos e estáticos
├── bun.lockb                    # Lockfile do Bun
├── Dockerfile                   # Configuração do Docker
├── fly.toml                     # Configuração para deploy no Fly.io
├── package.json                 # Scripts e dependências do projeto
├── svelte.config.js             # Configuração do Svelte
├── tsconfig.json                # Configuração do TypeScript
└── vite.config.ts               # Configuração do Vite para o bundler
```
---

## 📦 Tecnologias Usadas

- 🧩 [Svelte](https://svelte.dev/)
- 🔥 [Bun](https://bun.sh/)
- 🗾 [TypeScript](https://www.typescriptlang.org/)
- ⚙️ [Vite](https://vite.dev/)
- ☁️ [Fly.io (Deploy)](https://fly.io/)

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

- [Bun](https://bun.sh/) instalado

### Passos

0. Iniciar API localmente

[Instruções para rodar API localmente](https://github.com/hjunior29/expert-octo-memory-api.git)

1. Clone o repositório:

```bash
git clone https://github.com/hjunior29/expert-octo-memory-web.git
cd expert-octo-memory-web
```

2. Configurar `.env`

```
VITE_API_URL=http://localhost:3000   # Para ambiente de desenvolvimento
PUBLIC_API_URL=http://localhost:3000 # Para ambiente de produção
```

3. Instale as dependências:

```bash
bun install
```

4. Rode o servidor de desenvolvimento:

```bash
bun run dev
```

Abra `http://localhost:3000` no seu navegador para ver a aplicação rodando! 💻✨

---

## 📦 Build para produção

```bash
bun run build
```

Você pode pré-visualizar a versão de produção localmente:

```bash
bun run preview
```

---

## 🐳 Rodando com Docker

1. Build da imagem:

```bash
docker build -t expert-octo-memory-web .
```

2. Executar o container:

```bash
docker run -p 3000:3000 expert-octo-memory-web
```

---

## 🌍 Deploy com Fly.io

1. Instale o Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Faça login:

```bash
fly auth login
```

3. Crie a aplicação:

```bash
fly launch
```

4. Faça o deploy:

```bash
fly deploy
```

---

## 🤝 Contribuições

Sinta-se livre para abrir issues e pull requests! Qualquer sugestão ou melhoria é muito bem-vinda. 💛

---

Feito com 💻 + 🫶🏾 por [@hjunior29](https://github.com/hjunior29)

