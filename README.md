# GFin — Gestão Financeira Inteligente 🚀

**GFin** é uma plataforma premium de gestão financeira pessoal que combina o poder da **IA (Gemini 2.5 Flash)** com uma interface moderna e intuitiva. O objetivo é transformar a maneira como você lida com seu dinheiro, oferecendo desde controle de gastos simples até mentorias financeiras baseadas no seu perfil de risco.

![GFin Demo Video](https://github.com/lopesgabb/gfin/raw/main/public/screenshots/demo.webp)

---

## ✨ Funcionalidades Principais

- **📊 Dashboard Interativo:** Visualize seus gastos por categoria com gráficos dinâmicos e cards de métricas rápidas.
- **🤖 Mentor Financeiro IA:** Um mentor inteligente integrado ao Google Search para responder dúvidas sobre o mercado, analisar seus gastos e sugerir estratégias.
- **📈 Metas Financeiras:** Crie e acompanhe o progresso de seus objetivos financeiros com indicadores visuais.
- **🧮 Calculadoras Financeiras:** Ferramentas integradas para cálculo de juros compostos e planejamento de longo prazo.
- **📥 Importação Automática:** Importe seus extratos bancários (CSV/Excel) e deixe a IA classificar as categorias para você.
- **☁️ Firebase Cloud Sync:** Sincronização em tempo real entre dispositivos e autenticação segura com Google.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite e Tailwind CSS.
- **Estado:** Zustand (com persistência local e Firebase).
- **Gráficos:** Recharts para visualizações de dados precisas.
- **IA:** Google Gemini 2.5 Flash API (com Grounding em Google Search).
- **Backend/Auth:** Firebase Auth e Firestore Database.
- **Design:** Lucide Icons e animações com Framer Motion.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- Uma chave de API do **Google AI Studio (Gemini)**.

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/lopesgabb/gfin.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Adicione sua `GEMINI_API_KEY`.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🏛️ Arquitetura do Sistema

O GFin utiliza uma arquitetura baseada em **Camadas de Serviço** e **Stores Atômicas**, permitindo que o sistema funcione 100% offline (usando o sistema de Importação Local) ou totalmente integrado à nuvem através do Firebase.

### Chat Mentor
```
Mensagem do usuário + Contexto financeiro + Perfil → Gemini 2.5 Flash + Google Grounding → Resposta personalizada
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
