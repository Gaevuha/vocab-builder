# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

Коментар по структури

src/app/

layouts/ — коректно для AuthLayout / MainLayout

router/, AppRoutes.tsx, routes.ts — добре для налаштування React Router

App.tsx — кореневий компонент

src/components/

common/ — UI-компоненти (кнопки, інпути, лоадери, notification)

dashboard/ — компоненти Dashboard (Filters, Statistics, AddWordBtn)

forms/ — форми Login, Register, AddWordForm, EditWordForm

header/ — Header + UserNav + UserBar

modals/ — всі модалки (AddWordModal, EditWordModal, WellDoneModal)

training/ — TrainingRoom, ProgressBar

src/hooks/ — кастомні хуки (debounce, modal, auth, pagination)

src/pages/ — сторінки Login, Register, Dictionary, Recommend, Training

src/services/ — API-сервіси (authApi.ts, wordsApi.ts, trainingApi.ts, categoriesApi.ts)

src/store/ — Redux Toolkit (slices + store setup)

src/styles/ — глобальні CSS, можливо tailwind / css modules

src/types/ — всі TS типи

src/utils/ — допоміжні функції (sanitize, constants, routes)

src/main.tsx / main.ts — точка входу React + рендер в root
