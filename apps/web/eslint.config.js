import { nextJsConfig } from '@algocanvas/eslint-config/next-js';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: ['node_modules/**', '.next/**']
  },
  {
    rules: {
      // Disable turbo env var warnings - handled by Next.js env config
      'turbo/no-undeclared-env-vars': 'off',
      // Allow unused vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  }
];
