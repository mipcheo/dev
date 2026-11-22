/**
 * @import {
 *   Config as PrettierConfig,
 *   Options as PrettierOptions
 * } from 'prettier'
 */

/**
 * Base Prettier options.
 *
 * @type {PrettierOptions}
 */
export const baseOptions = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: false,
  objectWrap: 'preserve',
  printWidth: 160,
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  semi: true,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  // `ternaries` and `operatorPosition` are the names these take once Prettier drops "experimental";
  // Prettier 3.9 does not know them yet and warns on every run — turn them on when it does
  // ternaries: true,
  // operatorPosition: 'end',
  experimentalTernaries: true,
  experimentalOperatorPosition: 'end',
};

/**
 * Base Prettier configuration: the options every project shares.
 *
 * @returns {PrettierConfig} Base Prettier configuration.
 */
export function base() {
  return {
    ...baseOptions,
  };
}
