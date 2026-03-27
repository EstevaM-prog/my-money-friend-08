# 💸 CashFlow — Gestão Financeira Premium

> Gerenciador financeiro pessoal moderno, bonito e full-stack — com back-end em construção usando Go (Gin) para mais velocidade e segurança local.

---

## ✨ Visão Geral

O **CashFlow** é uma aplicação web de controle de finanças pessoais de elite. Originalmente 100% client-side, o sistema agora conta com um poderoso e ultra-rápido back-end em **Go (Golang)** integrado (via Gin), oferecendo toda a flexibilidade do servidor e ao mesmo tempo preservando a regra de ouro: **privacidade total e um design impecável**.

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) |
| Back-end | [Go](https://go.dev/) + [Gin](https://gin-gonic.com/) Framework |
| Linguagem | TypeScript (Front-end) + Go (Back-end) |
| Estilo | Tailwind CSS + CSS customizado (glassmorphism, anim. radiais) |
| Componentes | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Roteamento | [React Router DOM v6](https://reactrouter.com/) |
| Fontes | Google Fonts — _Inter_ + _Outfit_ |

---

## 📁 Estrutura do Projeto

```
backend/                 # Nova API do backend em Go (Gin)
├── main.go              # Arquivo de inicialização e rotas
├── go.mod               # Dependências do pacote Go
src/                     # Front-end React
├── components/
│   ├── charts/          # Componentes de gráficos Recharts
│   ├── finance/         # Cards, dialogs, toggles financeiros
│   ├── layout/          # AppLayout, Sidebar, Navbar, MobileNav
│   └── ui/              # shadcn/ui base components
├── hooks/               # Hooks customizados (useFinance, usePrivacy, …)
├── lib/
│   ├── auth.ts          # Autenticação via localStorage (login, register, session)
│   ├── finance-utils.ts # Utilitários de cálculo financeiro
│   ├── icons.ts         # Mapeamento categoria → ícone
│   └── utils.ts         # Helpers gerais
├── pages/
│   ├── Landing.tsx      # Página pública de apresentação (Premium Dark)
│   ├── PlanMode.tsx     # Página de planos e assinaturas (Stellar Style)
│   ├── Payment.tsx      # Página de checkout seguro com visualizador de cartão
│   ├── Login.tsx        # Login — aceita e-mail ou username
│   ├── Index.tsx        # Dashboard principal refinado
│   ├── Reports.tsx      # Relatórios e visualização de dados
│   ├── Support.tsx      # Central de ajuda e contato (Refatorado)
│   └── ...              # Outras páginas funcionais
└── index.css            # Design system, gradientes e animações
```

---

## ⚙️ Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd my-money-friend-08

# 2. Instale as dependências
npm install

# 3. Inicie o front-end (em um terminal)
npm run dev

# 4. Inicie o back-end da API (em outro terminal)
cd backend
go mod tidy
go run main.go
```

O front-end iniciará na porta padrão do Vite (geralmente `http://localhost:5173/`) e a API subirá em `http://localhost:8080/`.

---

## 🔐 Sistema de Autenticação

Em período de transição: originalmente 100% mockado via `localStorage`, as chamadas da API agora devem convergir de forma segura pelo servidor Go.

### Criar Conta (`/cadastro`)
- Nome completo, e-mail e senha.
- Sessão criada automaticamente após o cadastro.

### Login (`/login`)
- Aceita **e-mail** ou **username** (nome cadastrado).
- Opção "Lembrar por 7 dias" para sessão persistente.

---

## 🗺️ Rotas da Aplicação

| Rota | Página | Acesso |
|---|---|---|
| `/apresentacao` | Landing Page (Estilo Phylum) | Público |
| `/planos` | Pricing Tiers (Estilo Stellar) | Público |
| `/pagamento` | Checkout Seguro | Público |
| `/login` / `/cadastro` | Autenticação | Público |
| `/` | Dashboard Financeiro | 🔒 Autenticado |
| `/relatorios` | Gráficos e Analytics | 🔒 Autenticado |
| `/configuracoes` | Perfil e Preferências | 🔒 Autenticado |
| `/suporte` | Central de Ajuda | Público |

---

## 🎨 Design System Premium

- **Minimalismo Negro**: Fundo `#020205` com profundidade e glows radiais.
- **Glassmorphism**: Abordagem moderna com bordas translúcidas e `backdrop-blur`.
- **Micro-animações**: Transições de cards, glows pulsantes e hover states avançados.
- **Feedback Visual**: Cores semânticas consistentes (Success, Error, Warning).

---

## 📊 Funcionalidades Principais

- ✅ Dashboard completo com resumo mensal.
- ✅ Gestão de transações com ícones e categorias automáticas.
- ✅ Metas financeiras com barras de progresso.
- ✅ Checkout simulado com visualizador de cartão de crédito em tempo real.
- ✅ Suporte via Chat e E-mail integrado.
- ✅ Modo Privacidade (esconde valores com um clique).
- ✅ Export/Import de dados em formato JSON.

---

## 🔄 Scripts Disponíveis

```bash
npm run dev      # Inicia o ambiente de desenvolvimento
npm run build    # Gera a build otimizada para produção
npm run preview  # Testa a build de produção localmente
```

---

## 📝 Changelog Recente

### v0.9 (Mar 2026) - The Premium Update
- 💎 **Nova Landing Page**: Design totalmente reformulado com estética dark de alto nível.
- 💳 **Página de Checkout**: Implementação do `/pagamento` com visualizador dinâmico de cartão e suporte a Pix.
- 🏷️ **Página de Planos**: Novo layout de precificação inspirado em plataformas SaaS de elite.
* 🛠️ **Refactor de Suporte**: Central de ajuda modernizada com FAQ interativo.
* 📱 **Mobile UX**: Melhorias na barra de navegação inferior para dispositivos móveis.

---

> Desenvolvido com ❤️ · CashFlow Premium Finance · 2026
