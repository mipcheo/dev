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
 * Tailwindcss options.
 *
 * @param {Options} options The options for the Tailwindcss Prettier configuration.
 *
 * @returns {TailwindcssOptions} Tailwindcss options.
 */
export function tailwindcssOptions({ stylesheetPath }) {
  return {
    tailwindStylesheet: stylesheetPath,
    tailwindPreserveWhitespace: false,
    tailwindPreserveDuplicates: false,
    tailwindAttributes: ['className', '/.+ClassName/'],
    tailwindFunctions: ['cn', 'cva', 'tw'],
  };
}

/**
 * Tailwindcss Prettier configuration.
 *
 * @param {Options} options The options for the Tailwindcss Prettier configuration.
 *
 * @returns {PrettierConfig} Tailwindcss Prettier configuration.
 */
export function tailwindcss(options) {
  return {
    plugins: ['prettier-plugin-tailwindcss'],

    ...tailwindcssOptions(options),
  };
}
