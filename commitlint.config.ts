import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'server',
        'ui',
        'types',
        'eslint-config',
        'typescript-config',
        'root',
        'deps'
      ]
    ],
    'scope-empty': [1, 'never']
  }
};

export default config;
