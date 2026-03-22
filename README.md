# 💸 CashFlow — Gestão Financeira Premium

> Gerenciador financeiro pessoal moderno, bonito e 100% local — sem back-end, sem exposição de dados.

---

## ✨ Visão Geral

O **CashFlow** (anteriormente _My Money Friend_) é uma aplicação web de controle de finanças pessoais construída com React + TypeScript. Todos os dados são salvos no `localStorage` do browser — zero servidores, zero rastreamento.

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS + CSS customizado (glassmorphism, gradientes) |
| Componentes | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Roteamento | [React Router DOM v6](https://reactrouter.com/) |
| Fontes | Google Fonts — _Inter_ + _Outfit_ |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── charts/          # Componentes de gráficos Recharts
│   ├── finance/         # Cards, dialogs, toggles financeiros
│   ├── layout/          # AppLayout, Sidebar, Navbar
│   └── ui/              # shadcn/ui base components
├── hooks/               # Hooks customizados (useFinance, usePrivacy, …)
├── lib/
│   ├── auth.ts          # Autenticação via localStorage (login, register, session)
│   ├── finance-utils.ts # Utilitários de cálculo financeiro
│   ├── icons.ts         # Mapeamento categoria → ícone
│   └── utils.ts         # Helpers gerais
├── pages/
│   ├── Landing.tsx      # Página pública de apresentação (/)
│   ├── Login.tsx        # Login — aceita e-mail ou username
│   ├── Register.tsx     # Cadastro de nova conta
│   ├── Index.tsx        # Dashboard principal
│   ├── Accounts.tsx     # Contas e cartões
│   ├── Categories.tsx   # Categorias de transações
│   ├── Goals.tsx        # Metas financeiras
│   ├── Reports.tsx      # Relatórios e gráficos
│   ├── StrategicFinance.tsx # Finanças estratégicas
│   ├── Settings.tsx     # Configurações do usuário
│   ├── Support.tsx      # Suporte / contato
│   └── Documentation.tsx # Documentação interna
└── index.css            # Design system + utilitários CSS
```

---

## ⚙️ Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd my-money-friend-08

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

---

## 🔐 Sistema de Autenticação

Autenticação 100% client-side via `localStorage` — sem back-end necessário.

### Criar Conta (`/cadastro`)
- Nome completo, e-mail e senha
- Senha mínima de 6 caracteres
- Sessão criada automaticamente após o cadastro

### Login (`/login`)
- Aceita **e-mail** `seu@email.com` **ou username** (nome cadastrado) `joaosilva`
- Matching case-insensitive para o username
- Opção "Lembrar por 7 dias" (sessão persistente)
- Sem o "lembrar", a sessão expira ao fechar o browser

### Sessão
| Tipo | Comportamento |
|---|---|
| Com "lembrar" | Persiste por 7 dias no `localStorage` |
| Sem "lembrar" | Expira ao fechar a aba (via `sessionStorage`) |

---

## 🗺️ Rotas da Aplicação

| Rota | Página | Acesso |
|---|---|---|
| `/apresentacao` | Landing — apresentação do produto | Público |
| `/login` | Login (e-mail ou username) | Público |
| `/cadastro` | Criar nova conta | Público |
| `/` | Dashboard financeiro | 🔒 Autenticado |
| `/contas` | Contas e cartões | 🔒 Autenticado |
| `/categorias` | Categorias | 🔒 Autenticado |
| `/metas` | Metas financeiras | 🔒 Autenticado |
| `/relatorios` | Relatórios & gráficos | 🔒 Autenticado |
| `/financas-estrategicas` | Estratégia financeira | 🔒 Autenticado |
| `/configuracoes` | Perfil e configurações | 🔒 Autenticado |
| `/suporte` | Chat de suporte | 🔒 Autenticado |
| `/documentacao` | Documentação do app | 🔒 Autenticado |

---

## 🎨 Design System

- **Tipografia**: Inter (corpo) + Outfit (títulos)
- **Cor primária**: Emerald/Teal `hsl(160 84% 39%)`
- **Glassmorphism**: `.glass` — backdrop blur + border translúcido
- **Gradiente**: `.gradient-primary` — emerald 39% → 55%
- **Texto gradiente**: `.gradient-text` — animação infinita
- **Modo escuro**: Suporte total via Tailwind `dark:`
- **Animações**: `card-reveal`, `bounce-slow`, `textGradient`

---

## 📊 Funcionalidades Principais

- ✅ Dashboard com resumo mensal (receitas, despesas, saldo, economia)
- ✅ Lançamento de transações com categorias e ícones coloridos
- ✅ Receitas em **verde** e despesas em **vermelho** (visual imediato)
- ✅ Múltiplas contas e cartões
- ✅ Metas financeiras com acompanhamento de progresso
- ✅ Relatórios com gráficos (linha, barras, pizza)
- ✅ Finanças estratégicas e planejamento
- ✅ Tema claro / escuro
- ✅ Modo privacidade (ocultar valores)
- ✅ Export / Import de dados (JSON)
- ✅ Suporte integrado

---

## 🔄 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (Vite HMR)
npm run build    # Build de produção
npm run preview  # Preview do build de produção
npm run lint     # ESLint
```

---

## 📝 Changelog Recente

### v0.8 (Mar 2026)
- 🎨 Refactor completo da Landing page (hero, testimonials, benefit pills, floating cards)
- 🔐 Login agora aceita **e-mail ou username**
- 💸 Ícones e cores por categoria nas transações
- 🟢 Valores de receita em verde, despesas em vermelho

---

> Desenvolvido com ❤️ · CashFlow Premium · 2026
