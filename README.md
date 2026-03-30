# 💰 My Money Friend - Gestão Financeira Premium

[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Neon](https://img.shields.io/badge/Neon_Serverless-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**My Money Friend** é uma plataforma de gestão financeira full-stack de alta performance, projetada com uma estética moderna e suporte nativo a temas (Light/Dark). Construída com a robustez do **Go (Gin + Ent)** e a fluidez do **React**, a aplicação oferece um controle patrimonial completo em tempo real.

---

## ✨ Funcionalidades Principais

- 📊 **Dashboard Dinâmico**: Visualização instantânea de fluxos de caixa e distribuição de despesas.
- 🌓 **Tematização Híbrida**: Suporte total a modo claro e escuro em todos os componentes e gráficos.
- 🏦 **Multi-Contas**: Gerenciamento unificado de saldos bancários, carteiras e cartões de crédito.
- 🎯 **Engenharia de Sonhos**: Definição e acompanhamento de metas financeiras com barra de progresso premium.
- 🏷️ **Taxonomia Customizada**: Criação de categorias e ícones personalizados para sua rotina.
- 💡 **Estratégia Financeira**: Implementação nativa da regra 50/30/20 para otimização de gastos.
- 🛡️ **Conexão Segura**: Backend em Go com Ent ORM integrado ao banco de dados Neon Serverless.

---

## 🚀 Tecnologias

### **Frontend**
- **Vite & React 18**: Framework e bundling de ultra performance.
- **Tailwind CSS**: Estilização baseada em tokens com suporte a `dark:`.
- **Framer Motion**: Micro-animações e transições de página fluidas.
- **Lucide React**: Biblioteca de ícones consistente e minimalista.
- **Recharts**: Gráficos complexos e responsivos adaptáveis ao tema.

### **Backend**
- **Go 1.24**: Linguagem de alta performance para sistemas escaláveis.
- **Gin Web Framework**: Roteamento HTTP rápido e middleware robusto.
- **Ent ORM**: Entity framework para modelagem de dados segura e tipada.
- **PostgreSQL (Neon)**: Banco de dados serverless de baixa latência.
- **Swagger**: Documentação interativa da API.

---

## 🛠️ Como Iniciar

### **Requisitos**
- Go 1.24+
- Node.js 18+
- Instância no [Neon.tech](https://neon.tech)

### **Configuração do Ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgresql://usuário:senha@host/neondb?sslmode=require
PORT=8080
```

### **Passo a Passo**

#### **1. Instalação & Backend**
```bash
cd backend
go mod tidy                     # Instala dependências do Go
go generate ./ent               # Gera o cliente Ent
go run migrate.go               # Sincroniza o schema com o Neon
go run main.go                  # Inicia o servidor na porta 8080
```

#### **2. Frontend**
```bash
# De volta à raiz do projeto
npm install                     # Instala dependências (Vite, Tailwind, etc.)
npm run dev -- --port 5173       # Inicia o frontend na porta 5173
```

---

## 📖 API Documentation

A documentação interativa da API está disponível via **Swagger** em tempo de execução:
👉 `http://localhost:8080/swagger/index.html`

## 🏗️ Estrutura do Projeto

```text
├── backend/               # Servidor Go (Gin + Ent)
│   ├── ent/               # Schemas e Código Gerado (ORM)
│   ├── handler/           # Controladores das rotas
│   ├── routes/            # Definição dos endpoints
│   ├── main.go            # Entry point do servidor
│   └── migrate.go         # Script de migração do banco
├── src/                   # Frontend React
│   ├── components/        # Componentes UI (Theme Aware)
│   ├── hooks/             # Lógica de estado e API
│   ├── pages/             # Páginas da aplicação
│   └── lib/               # Utilitários e instâncias (axios, logic)
└── README.md
```

---

> Desenvolvido com ❤️ por [CashFlow Premium Finance] · 2026
