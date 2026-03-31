# GFin — Gestão Financeira Inteligente 🚀

**GFin** é uma sistema local de gestão financeira pessoal que combina o poder da **IA (Gemini 2.5 Flash ou Pro)** com uma interface moderna e intuitiva. O objetivo é transformar a maneira como você lida com seu dinheiro, oferecendo desde controle e organização de gastos simples até dicas financeiras baseadas no seu perfil de risco (contém um quiz que indica seu provável perfil).


---

## ✨ Funcionalidades Principais

- **📊 Dashboard Interativo:** Visualize seus gastos por categoria com gráficos dinâmicos, sendo possível agrupar/ filtrar o mês e/ou a categoria 
- **🤖 Mentor Financeiro IA:** Um chat inteligente integrado ao Google Search, com acesso a dados em tempo real para responder dúvidas sobre o mercado, analisar seus gastos e sugerir estratégias.
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
| ![Dashboard](https://github.com/user-attachments/assets/4c652564-d741-4ba1-819a-70d1a4cf1434) | ![Metas](https://github.com/user-attachments/assets/b3a96587-f495-4cff-b8df-c08129c92202) |
| **Mentor IA (Chat)** | **Calculadoras** |
| ![Chat](https://github.com/user-attachments/assets/168e339a-fc9e-4d61-9f6d-1f405f35032b) | ![Calculadoras](https://github.com/user-attachments/assets/43b6a2c3-5ee5-48ec-91da-c96cc569c0f6) |
*Nota: As imagens acima mostram dados fictícios para fins de demonstração.*

## Disclaimer:
Este conteúdo tem caráter exclusivamente educacional e informativo, não constituindo recomendação de investimento, oferta ou solicitação de compra ou venda de ativos financeiros.
Antes de tomar qualquer decisão de investimento, consulte um profissional devidamente habilitado e considere seu perfil de risco.


## 📄 License

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para detalhes.

---

<div align="center">


</div>
