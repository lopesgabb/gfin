<div align="center">

# 💰 GFin

**Gestão financeira inteligente com IA generativa**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Pro-Google_AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

*Dashboard financeiro com chat IA, extração de dados via PDF/imagem, orçamentos, metas e calculadoras financeiras.*

</div>

---

## ✨ Features

| Feature | Descrição |
|---|---|
| 🤖 **Chat com IA** | Mentor financeiro personalizado usando **Gemini 2.5 Pro** com Google Search Grounding para dados em tempo real |
| 📄 **ETL Inteligente** | Upload de PDFs/imagens de faturas → extração automática de despesas via Gemini com schema JSON estruturado |
| 📊 **Dashboard** | Visualização de gastos por categoria com gráficos interativos (Recharts) |
| 💰 **Orçamentos** | Controle de orçamento por categoria com alertas visuais de limite |
| 🎯 **Metas Financeiras** | Criação de metas com acompanhamento de progresso e cálculo de aporte mensal necessário |
| 🧮 **Calculadoras** | Juros compostos, independência financeira, reserva de emergência e comparação CDB vs Poupança |
| 🔐 **Autenticação** | Login com Google via Firebase Auth (opcional) |
| ☁️ **Cloud Sync** | Dados sincronizados em tempo real via Cloud Firestore (opcional) |
| 💾 **Persistência Local** | Funciona 100% offline com localStorage — dados salvos sem configuração |
| 📋 **Responsivo** | Interface adaptada para desktop e mobile |

## 🏗️ Arquitetura

```
gfin/
├── components/          # Componentes React
│   ├── budget/          # Página de orçamentos
│   ├── calculators/     # Calculadoras financeiras
│   ├── goals/           # Metas financeiras
│   ├── ui/              # Componentes base (Button, Card, Modal)
│   ├── ChatInterface    # Chat com Gemini
│   ├── Dashboard        # Dashboard principal
│   └── Sidebar          # Navegação lateral
├── hooks/               # Custom hooks
├── services/            # Camada de serviços
│   ├── gemini.ts        # SDK @google/genai (ETL + Chat)
│   ├── firebase.ts      # Firebase Auth + Firestore (opcional)
│   └── storage.ts       # Persistência local com localStorage
├── stores/              # Estado global (Zustand)
├── constants/           # Quiz de perfil investidor
└── types.ts             # TypeScript interfaces
```

## 🛠️ Tech Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19, TypeScript 5.8 |
| **State** | Zustand 5 (persist middleware) |
| **AI/ML** | Gemini 2.5 Pro (`@google/genai`) |
| **Search** | Google Search Grounding |
| **Auth** | Firebase Authentication (Google Sign-In) |
| **Database** | Cloud Firestore (real-time sync) |
| **Charts** | Recharts 3 |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Build** | Vite 6 |
| **Styling** | TailwindCSS (CDN) |

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+
- Gemini API Key (para funcionalidades de IA)

### 1. Clone o repositório

```bash
git clone https://github.com/lopesgabb/gfin.git
cd gfin
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

```env
# .env.local
API_KEY=sua_gemini_api_key

# Firebase (Opcional — apenas para sincronização em nuvem)
VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

> **Como obter:**
> - **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/apikey)
> - **Firebase Config** (opcional): [Firebase Console](https://console.firebase.google.com) → Configurações do Projeto → veja `FIREBASE_SETUP.md`

### 4. Execute

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

> 💡 **Funciona sem Firebase!** O app usa `localStorage` por padrão. Os dados persistem entre sessões sem nenhuma configuração de banco de dados.

## 🤖 Como a IA funciona

### ETL (Extração de Dados)
```
PDF/Imagem → Gemini 2.5 Pro (schema JSON) → Despesas estruturadas
```
- Utiliza `responseMimeType: "application/json"` com `responseSchema` tipado
- Temperature `0.0` para máxima consistência na extração
- Categoriza automaticamente em 11 categorias financeiras

### Chat Mentor
```
Mensagem do usuário + Contexto financeiro + Perfil → Gemini 2.5 Pro + Google Grounding → Resposta personalizada
```
- `systemInstruction` com o perfil de risco e dados financeiros do usuário
- Google Search Grounding para cotações e notícias em tempo real
- Histórico de conversa mantido para contexto contínuo

## 📸 Screenshots

| Dashboard | Metas Financeiras |
| :---: | :---: |
| ![Dashboard](./public/screenshots/1.png) | ![Metas](./public/screenshots/2.png) |
| **Mentor IA (Chat)** | **Calculadoras** |
| ![Chat](./public/screenshots/3.png) | ![Calculadoras](./public/screenshots/4.png) |

*Nota: As imagens acima mostram dados fictícios para fins de demonstração.*

## 📄 License

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para detalhes.

---

<div align="center">

**Desenvolvido com ❤️ usando React, Gemini AI e Firebase**

</div>