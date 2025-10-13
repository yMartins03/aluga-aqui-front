# 🏠 Aluga Aqui - Frontend

Sistema de locação imobiliária desenvolvido com React + TypeScript + Vite.

## 🚀 Deploy na Vercel

### Pré-requisitos
1. Backend da aplicação já deployado na Vercel
2. Conta no GitHub e na Vercel

### Passos para Deploy

1. **Criar repositório no GitHub e fazer push do código**
```bash
git init
git add .
git commit -m "Initial commit - Aluga Aqui Frontend"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aluga-aqui-front.git
git push -u origin main
```

2. **Configurar na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Vincule sua conta ao GitHub
   - Clique em "New Project"
   - Selecione o repositório do frontend
   - Configure a variável de ambiente:
     - `VITE_API_URL`: URL da sua API deployada na Vercel
   - Clique em "Deploy"

### Variáveis de Ambiente
Defina na Vercel a seguinte variável:
- `VITE_API_URL`: https://sua-api-url.vercel.app

## 🛠️ Desenvolvimento Local

### Instalação

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
