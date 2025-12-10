import tseslint from "typescript-eslint";
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    settings: {
      react: { version: "detect" },
    },
  },

  ...fixupConfigRules(compat.extends("next/core-web-vitals")),
  ...fixupConfigRules(compat.extends("airbnb")),
  ...fixupConfigRules(compat.extends("airbnb-typescript")),
  ...fixupConfigRules(compat.extends("airbnb/hooks")),

  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "react/button-has-type": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-throw-literal": "off",
    },
  },

  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "jest.setup.ts",
    ],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },

  eslintConfigPrettier,

  {
    ignores: [
      "node_modules/",
      "public/",
      ".next/",
      "dist/",
      "build/",
      "out/",
      "package-lock.json",
      "yarn.lock",
      "*.config.js",
      "generated/",
      "coverage/",
      ".env",
    ],
  },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
];
