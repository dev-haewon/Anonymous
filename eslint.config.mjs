import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin'; // typescript-eslint plugin import 추가
import tseslintParser from '@typescript-eslint/parser'; // typescript-eslint parser import 추가

export default [
    {
        ignores: [
            'dist/**',
            'gulpfile.js',
            'tailwind.config.js',
            'scripts/**',
            'node_modules/**',
        ], // 제외할 파일들
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,tsx}'], // tsx 추가 (TypeScript JSX 파일도 포함)
        languageOptions: {
            parser: tseslintParser, // TypeScript 파일을 위한 파서
            globals: globals.browser, // 브라우저 환경의 글로벌 변수 사용 설정
        },
        plugins: {
            '@typescript-eslint': tseslint, // TypeScript ESLint 플러그인 추가
        },
        rules: {
            // ESLint 및 TypeScript 관련 추천 규칙들을 병합
            ...pluginJs.configs.recommended.rules, // 기본 JavaScript 추천 규칙
            ...tseslint.configs.recommended.rules, // TypeScript 추천 규칙
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-this-alias': 'off',
        },
    },
];
