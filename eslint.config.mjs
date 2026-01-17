import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow warnings to not fail the build
      "@next/next/no-img-element": "warn",
      "@next/next/no-async-client-component": "warn",
      "@next/next/google-font-display": "warn",
      "@next/next/no-page-custom-font": "warn",
    },
  },
];

export default eslintConfig;
