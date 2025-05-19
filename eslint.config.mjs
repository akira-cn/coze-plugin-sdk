import eslint from 'eslint';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // Node.js 全局变量
        'process': 'readonly',
        'module': 'readonly',
        'require': 'readonly',
        '__dirname': 'readonly',
        '__filename': 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // 基本规则
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则代替
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      
      // TypeScript 特定规则
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      
      // 代码风格规则
      'semi': 'off',
      '@typescript-eslint/semi': ['error', 'always'],
      'quotes': 'off',
      '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }],
      'indent': 'off',
      '@typescript-eslint/indent': ['error', 2],
      'comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': 'off',
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      
      // 函数规则
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': 'error',
      'func-call-spacing': 'off',
      '@typescript-eslint/func-call-spacing': ['error', 'never'],
      
      // 错误处理
      'no-throw-literal': 'off',
      '@typescript-eslint/no-throw-literal': 'error',
      
      // 注释规则
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
    },
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];