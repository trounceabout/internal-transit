import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    // Astro's own build output and every package manager's install dir —
    // linting either is both slow and pointless (generated/vendored code).
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
  },

  ...eslintPluginAstro.configs.recommended,

  // TypeScript + TSX (islands, Uc* components, lib/ helpers) — the parser
  // alone (already installed before this pass) doesn't turn on any rules by
  // itself; the plugin's `flat/recommended` config is what actually lints.
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
    },
    rules: {
      ...tseslint.configs["flat/recommended"].rules,
      ...reactHooks.configs["recommended-latest"].rules,
    },
  },

  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },

  // Must stay last — it only disables stylistic rules that would otherwise
  // conflict with Prettier's own formatting, so anything appended after it
  // could silently re-enable a conflicting rule.
  eslintConfigPrettier,
];
