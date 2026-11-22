/** @import {Linter} from 'eslint' */

import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';

import { ACTION_JS_FILE_PATTERN, ACTION_TS_FILE_PATTERN, JS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';

/**
 * @typedef {{
 *   projectDir: string;
 * }} Options
 */

/**
 * NextJS ESLint configuration.
 *
 * @param {Options} options The options for the NextJS ESLint configuration.
 *
 * @returns {Linter.Config[]} NextJS ESLint configuration.
 */
export function nextjs(options) {
  return defineConfig(
    globalIgnores(['**/.next/**', '**/next-env.d.ts']),
    {
      files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
      extends: [nextPlugin.configs.recommended, nextPlugin.configs['core-web-vitals']],
      settings: {
        next: {
          rootDir: options.projectDir,
        },
      },
    },
    {
      files: [ACTION_JS_FILE_PATTERN, ACTION_TS_FILE_PATTERN],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Program[body.length>0]:not(:has(ExpressionStatement[expression.value="use server"]))',
            message: `Actions must be server components. Use 'use server' in the first line of the action file.`,
          },
        ],
      },
    }
  );
}
