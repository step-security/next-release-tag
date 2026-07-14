import {type FlatXoConfig} from 'xo';

const xoConfig: FlatXoConfig = [
  {
    prettier: true,
    space: true,
  },
  {
    ignores: ['README.md', 'SECURITY.md'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    rules: {
      'import-x/extensions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-restricted-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-unnecessary-template-expression': 'off',
      '@eslint-community/eslint-comments/require-description': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-for-each': 'off',
      'unicorn/no-unsafe-string-replacement': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-array-from-fill': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/name-replacements': 'off',
      'require-unicode-regexp': 'off',
      'prettier/prettier': 'off',
      'curly': 'off',
      '@stylistic/quotes': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
      'unicorn/escape-case': 'off',
      'n/prefer-global/process': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },
];

export default xoConfig;
