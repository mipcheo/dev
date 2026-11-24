/**
 * @import {
 *   Config as PrettierConfig,
 *   Options as PrettierOptions
 * } from 'prettier'
 */

import { MARKDOWN_FILE_PATTERN } from '../constants.js';

/**
 * Markdown Prettier configuration: compact tables, and the Markdown options for Markdown files only.
 *
 * @returns {PrettierConfig} Markdown Prettier configuration.
 */
export function markdown() {
  /** @type {PrettierOptions} */
  const markdownOptions = {
    printWidth: Infinity,
    proseWrap: 'never',
  };

  return {
    plugins: ['prettier-plugin-markdown-compact-tables'],

    overrides: [
      {
        files: [MARKDOWN_FILE_PATTERN],
        options: markdownOptions,
      },
    ],
  };
}
