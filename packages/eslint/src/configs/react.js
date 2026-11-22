/** @import {Linter} from 'eslint' */

import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

import { JS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';

/**
 * React ESLint configuration: React, its hooks and fast refresh, and JSX accessibility. Added where the stack exists, after `base()`.
 *
 * @returns {Linter.Config[]} React ESLint configuration.
 */
export function react() {
  return defineConfig({
    files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
    extends: [
      reactPlugin.configs.flat['recommended'] ?? {},
      reactPlugin.configs.flat['jsx-runtime'] ?? {},
      reactHooksPlugin.configs.flat['recommended-latest'],
      reactRefreshPlugin.configs.vite,

      jsxA11yPlugin.flatConfigs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: '19',
      },
    },
    rules: {
      // React
      'react-refresh/only-export-components': [
        'off',
        {
          allowConstantExport: true,
        },
      ],
      'react/prop-types': [
        'error',
        {
          skipUndeclared: true,
        },
      ],

      // JSX
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
    },
  });
}
