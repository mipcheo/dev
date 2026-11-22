/** @import {Linter} from 'eslint' */

import * as mdxPlugin from 'eslint-plugin-mdx';
import storybookPlugin from 'eslint-plugin-storybook';
import { defineConfig } from 'eslint/config';

import { JS_FILE_PATTERN, MDX_FILE_PATTERN, STORYBOOK_JS_FILE_PATTERN, STORYBOOK_TS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';

/**
 * Storybook ESLint configuration.
 *
 * @returns {Linter.Config[]} Storybook ESLint configuration.
 */
export function storybook() {
  return defineConfig(
    {
      files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
      extends: [
        {
          files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
          ...storybookPlugin.configs['flat/recommended'],
        },
      ],
    },
    {
      files: [MDX_FILE_PATTERN],
      ...mdxPlugin.flat,
      ...mdxPlugin.flatCodeBlocks,
    },
    {
      files: [STORYBOOK_TS_FILE_PATTERN, STORYBOOK_JS_FILE_PATTERN],
      rules: {
        'import-x/no-extraneous-dependencies': 'off',
      },
    }
  );
}
