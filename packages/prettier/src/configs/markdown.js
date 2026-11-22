/**
 * @import {
 *   Config as PrettierConfig,
 *   Options as PrettierOptions
 * } from 'prettier'
 */

import { MARKDOWN_FILE_PATTERN } from '../constants.js';

/**
 * Markdown options: each paragraph on one line, so a frontmatter `tags` line stays one line.
 *
 * @type {PrettierOptions}
 */
export const markdownOptions = {
  printWidth: Infinity,
  proseWrap: 'never',
};

/**
 * Markdown Prettier configuration: compact tables, and the Markdown options for Markdown files only.
 *
 * @returns {PrettierConfig} Markdown Prettier configuration.
 */
export function markdown() {
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
