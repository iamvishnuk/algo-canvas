import { config } from '@algocanvas/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['apps/**', 'packages/**']
  }
];
