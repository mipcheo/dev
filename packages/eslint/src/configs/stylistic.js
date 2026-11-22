/** @import {Linter} from 'eslint' */

// @ts-expect-error https://github.com/eslint-stylistic/eslint-stylistic/issues/1331
import stylisticPlugin from '@stylistic/eslint-plugin';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

import { JS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';

/**
 * @typedef {{
 *   namespace?: string;
 * }} Options
 */

/**
 * Stylistic ESLint configuration: the layout rules kept on after Prettier's config turned the formatting rules off, and the order of a file's imports, exports
 * and declarations. Added after `prettier()`.
 *
 * @param {Options} options The options for the Stylistic ESLint configuration.
 *
 * @returns {Linter.Config[]} Stylistic ESLint configuration.
 */
export function stylistic({ namespace = '' }) {
  return defineConfig({
    files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
    plugins: {
      '@stylistic': stylisticPlugin,
      'perfectionist': perfectionistPlugin,
    },
    rules: {
      // Standard
      'curly': ['error', 'all'],
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'no-unneeded-ternary': 'error',
      'id-length': [
        'error',
        {
          min: 3,
          properties: 'never',
          exceptions: [
            'id',
            'fs',
            'os',
            'at',
            'to',
            'js',
            'ts',
            'CD',
          ],
        },
      ],

      // Unicorn
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
      'unicorn/numeric-separators-style': [
        'error',
        {
          number: {
            minimumDigits: 5,
            groupLength: 3,
          },
        },
      ],
      'unicorn/single-line-block-comment-style': ['error', 'single-line'],
      'unicorn/prefer-ternary': ['error', 'only-single-line'],

      // Import/Export
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // Perfectionist
      'perfectionist/sort-imports': [
        'error',
        {
          internalPattern: [`^@${namespace}/`],
          newlinesBetween: 1,
          groups: [
            'side-effect',
            'type-builtin',
            { newlinesBetween: 0 },
            'type-external',
            'type-internal',
            { newlinesBetween: 0 },
            ['type-parent', 'type-sibling', 'type-index'],
            'value-builtin',
            { newlinesBetween: 0 },
            'value-external',
            'value-internal',
            { newlinesBetween: 0 },
            ['value-parent', 'value-sibling', 'value-index'],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-exports': [
        'error',
        {
          groups: ['type-export', 'value-export'],
          newlinesBetween: 1,
          newlinesInside: 0,
        },
      ],
      'perfectionist/sort-named-exports': [
        'error',
        {
          groups: ['type-export', 'value-export'],
        },
      ],
      'perfectionist/sort-modules': [
        'error',
        {
          type: 'unsorted',
          newlinesBetweenOverloadSignatures: 1,
          groups: [
            [
              'export-enum',
              'export-interface',
              'export-type',
              'export-class',
              'export-function',
            ],
            [
              'enum',
              'interface',
              'type',
              'class',
              'function',
            ],
          ],
        },
      ],

      // Stylistic
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
      '@stylistic/lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,

          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
          allowInterfaceStart: true,
          allowTypeStart: true,
          allowEnumStart: true,
          allowModuleStart: true,

          afterHashbangComment: true,
        },
      ],
      '@stylistic/list-style': [
        'error',
        {
          overrides: {
            '()': 'off',
            '[]': 'off',
            '{}': 'off',
            '<>': 'off',

            'ArrayExpression': { singleLine: { maxItems: 3 } },
            'ArrayPattern': { singleLine: { maxItems: 3 } },
            'ObjectExpression': { singleLine: { spacing: 'always', maxItems: 3 } },
          },
        },
      ],
    },
  });
}
