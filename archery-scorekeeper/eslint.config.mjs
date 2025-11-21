import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            indent: ["error", 4],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "import/order": [
                /* 1. Side Effects
                ** 2. External (Node) imports
                ** 3. Internal (Absolute @) imports
                ** 4. Internal (Relative ..) imports
                */
                "error",
                {
                    // Defines the order of import groups
                    "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "pathGroups": [
                        {
                            "pattern": "react", 
                            "group": "external",
                            "position": "before"
                        },
                        {
                            "pattern": "@/**",
                            "group": "internal"
                        }
                    ],
                    "alphabetize": {
                        "order": "asc",
                        "caseInsensitive": true
                    },
                    "newlines-between": "always"
                }
            ]
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
    // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
