/** @import {Config as PrettierConfig} from 'prettier' */

/**
 * Define Prettier configuration.
 *
 * @param {PrettierConfig[]} configs Configurations to merge.
 *
 * @returns {PrettierConfig} Prettier configuration.
 */
export function defineConfig(...configs) {
  /** @type {PrettierConfig} */
  const result = {};

  for (const { plugins = [], ...options } of configs) {
    result.plugins ??= [];
    result.plugins.push(...plugins);

    Object.assign(result, options);
  }

  return result;
}
