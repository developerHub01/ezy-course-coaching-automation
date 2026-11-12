import js from "@eslint/js";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/*
 * Local rule: bans "//" line comments. Use block comments instead (CLAUDE.md section 6).
 */
const noLineComments = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      noLine: "Use a block comment (/* ... */) instead of a // line comment.",
    },
  },
  create: (context) => ({
    Program: () => {
      for (const comment of context.sourceCode.getAllComments()) {
        if (comment.type === "Line") {
          context.report({
            loc: comment.loc,
            messageId: "noLine",
          });
        }
      }
    },
  }),
};

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
      /* No braces around a single one-line statement; braces only when the body spans lines. */
      curly: ["error", "multi-or-nest"],
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
              group: ["../*", "..", "./*"],
              message: 'Use the absolute "@/" alias for every import, never "./" or "../".',
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
  {
    /*
     * Placed after "prettier" on purpose: these formatting rules are kept on because
     * Prettier preserves objects that are already written multiline.
     */
    files: ["src/**/*.ts", "playwright.config.ts"],
    plugins: {
      local: {
        rules: {
          "no-line-comments": noLineComments,
        },
      },
    },
    rules: {
      "local/no-line-comments": "error",
      "multiline-comment-style": ["error", "starred-block"],
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            minProperties: 1,
            multiline: true,
            consistent: true,
          },
        },
      ],
      "object-property-newline": "error",
    },
  },
);
