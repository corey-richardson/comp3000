import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/node_modules/", "**/dist/", "archeryutils-service"],
    },
    {
        files: [ "**/*.{js,jsx,ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...global.browser, ...globals.node },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-console": "warn",
            "quotes": ["error", "double", { avoidEscape: true }],
            "indent": ["error", 4, { SwitchCase: 1 }],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "always"],
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
            "semi": ["error", "always"],
            "object-curly-spacing": ["error", "always"],
            "import/order": ["error", { 
                "groups": ["builtin", "external", "internal", ["parent", "sibling"], "index"],
                "newlines-between": "always",
                "alphabetize": { "order": "asc", "caseInsensitive": true }
            }],
        },
    },
    {
        files: ["**/frontend/src/**/*.{js,jsx,ts,tsx}"],
        plugins: { react: reactPlugin },
        settings: { react: { version: "detect" } },
        rules: {
            ...reactPlugin.configs.flat.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",
            "react/jsx-uses-vars": "error",
        },
    }
)
