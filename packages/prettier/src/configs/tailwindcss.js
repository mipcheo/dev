/**
 * @import {Config as PrettierConfig} from 'prettier'
 * @import {PluginOptions as TailwindcssOptions} from 'prettier-plugin-tailwindcss'
 */

/**
 * @typedef {{
 *   stylesheetPath: string;
 * }} Options
 */

/**
 * Tailwindcss Prettier configuration.
 *
 * @param {Options} options The options for the Tailwindcss Prettier configuration.
 *
 * @returns {PrettierConfig} Tailwindcss Prettier configuration.
 */
export function tailwindcss({ stylesheetPath }) {
  /** @type {TailwindcssOptions} */
  const tailwindcssOptions = {
    tailwindStylesheet: stylesheetPath,
    tailwindPreserveWhitespace: false,
    tailwindPreserveDuplicates: false,
    tailwindAttributes: ['className', '/.+ClassName/'],
    tailwindFunctions: ['cn', 'cva', 'tw'],
  };

  return {
    plugins: ['prettier-plugin-tailwindcss'],
    ...tailwindcssOptions,
  };
}
