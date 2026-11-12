import js from "@eslint/js";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules", "playwright-report", "test-results", "playwright/.auth"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "playwright.config.ts"],
    rules: {
      // Code style rules from CLAUDE.md section 6
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "arrow-body-style": ["error", "as-needed"],
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration",
          message: "Use arrow functions only (CLAUDE.md section 6).",
        },
        {
          selector: ":not(MethodDefinition) > FunctionExpression",
          message: "Use arrow functions only (CLAUDE.md section 6).",
        },
      ],
      // Imports (CLAUDE.md section 7): absolute "@/" only, no "../" climbing
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", ".."],
              message: 'Use the absolute "@/" alias instead of climbing with "../".',
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.spec.ts", "src/tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "error",
      "playwright/no-force-option": "error",
    },
  },
  prettier,
);
