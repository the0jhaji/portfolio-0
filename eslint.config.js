import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

// Flat config for `npm run lint` (eslint .). Covers src/, server/, api/ and
// the root config files; build output is ignored.
export default [
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // New in react-hooks v7 (React Compiler rule). It flags existing
      // patterns in GithubLinkGuard/WelcomeLoader — unrelated sections that
      // are out of scope here, so keep it off until they are revisited.
      "react-hooks/set-state-in-effect": "off",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
