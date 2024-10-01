import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    ignores: ['dist/**', 'gulpfile.js', 'tailwind.config.js', 'scripts/**', 'node_modules/**'],
  },
  { files: ["src/**/*.{js,mjs,cjs,ts}"] }, // src 디렉토리 내의 파일만 검사
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];