/** @import {Linter} from 'eslint' */

import * as mdxPlugin from 'eslint-plugin-mdx';
import storybookPlugin from 'eslint-plugin-storybook';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import {
  JS_FILE_PATTERN,
  MDX_CODE_BLOCK_FILE_PATTERN,
  MDX_FILE_PATTERN,
  STORYBOOK_JS_FILE_PATTERN,
  STORYBOOK_TS_FILE_PATTERN,
  TS_FILE_PATTERN,
} from '../constants.js';

/**
 * Storybook ESLint configuration: the Storybook rules for stories and `.storybook/main.*`, linting of Markdown and MDX files and the code blocks in them, and
 * dev dependencies allowed in `.storybook/`.
 *
 * @returns {Linter.Config[]} Storybook ESLint configuration.
 */
export function storybook() {
  return defineConfig(
    {
      files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
      // @ts-expect-error https://github.com/storybookjs/storybook/issues/34468
      extends: [storybookPlugin.configs['flat/recommended']],
    },
    {
      ...mdxPlugin.flat,
      files: [MDX_FILE_PATTERN],
      processor: mdxPlugin.createRemarkProcessor({
        lintCodeBlocks: true,
      }),
    },
    {
      ...mdxPlugin.flatCodeBlocks,
      files: [MDX_CODE_BLOCK_FILE_PATTERN],
    },
    {
      files: [MDX_CODE_BLOCK_FILE_PATTERN],
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      files: [STORYBOOK_TS_FILE_PATTERN, STORYBOOK_JS_FILE_PATTERN],
      rules: {
        'import-x/no-extraneous-dependencies': 'off',
      },
    }
  );
}
