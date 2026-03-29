# Configuração do Firebase para GFin

Para habilitar a sincronização em nuvem e autenticação por email/Google, siga os passos abaixo:

## 1. Criar Projeto no Console do Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em "Adicionar Projeto" e dê o nome de **GFin**.
3. Ative o Google Analytics (opcional).

## 2. Configurar Autenticação
1. No menu lateral, acesse **Authentication** > **Get Started**.
2. Ative os métodos:
   - **Google** (Configure o e-mail de suporte).
   - **E-mail/Senha** (Opcional).

## 3. Criar Banco de Dados Firestore
1. Vá em **Firestore Database** > **Create Database**.
2. Escolha o local mais próximo (ex: `southamerica-east1` para Brasil).
3. Comece no **Modo de Produção**.
4. Configure as regras de segurança básicas:
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 4. Registrar a Web App
1. No painel do projeto, clique no ícone `</>` (Web).
2. Registre como **GFin Web**.
3. Copie as credenciais fornecidas (`firebaseConfig`).

## 5. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e preencha com seus dados:
```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=gfin-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gfin-xxxx
VITE_FIREBASE_STORAGE_BUCKET=gfin-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxx
```

## 6. Pronto!
O sistema detectará automaticamente as variáveis de ambiente e alternará do **Modo Local (LocalStorage)** para o **Modo Cloud (Firebase)**.
