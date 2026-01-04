import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
];
