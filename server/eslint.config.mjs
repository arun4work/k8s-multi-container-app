import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      }, // Add Node.js global variables
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // Must be last to override other rules
  {
    rules: {
      'no-console': 'off', // Usually 'off' for Workers/CLI tools
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
