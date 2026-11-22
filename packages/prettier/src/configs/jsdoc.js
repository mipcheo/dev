/**
 * @import {
 *   Plugin,
 *   Config as PrettierConfig
 * } from 'prettier'
 * @import {Options as JSDocOptions} from 'prettier-plugin-jsdoc'
 * @import {MultilineArrayOptions} from 'prettier-plugin-multiline-arrays'
 */

import * as jsdocPlugin from 'prettier-plugin-jsdoc';
import * as multilineArrayPlugin from 'prettier-plugin-multiline-arrays';

/**
 * JSDoc options.
 *
 * @type {JSDocOptions}
 */
export const jsdocOptions = {
  tsdoc: true,
  jsdocDescriptionWithDot: true,
  jsdocSeparateReturnsFromParam: true,
  jsdocPreferCodeFences: true,
  jsdocSeparateTagGroups: true,
};

/** @type {MultilineArrayOptions} */
const multilineArrayOptions = {
  multilineArraysWrapThreshold: 3,
  multilineArraysLinePattern: '',
};

/** @type {Plugin} */
const jsdocWithMultilineArrayPlugin = {
  ...multilineArrayPlugin,
  ...jsdocPlugin,
  options: {
    ...multilineArrayPlugin.options,
    ...jsdocPlugin.options,
  },
  defaultOptions: {
    ...multilineArrayPlugin.defaultOptions,
    ...jsdocPlugin.defaultOptions,
  },
  parsers: {
    ...multilineArrayPlugin.parsers,
    ...Object.fromEntries(
      Object.entries(jsdocPlugin.parsers).map(([name, parser]) => {
        const arraysParser = multilineArrayPlugin.parsers[name];
        if (!arraysParser) {
          return [name, parser];
        }

        /** @type {import('prettier').Parser} */
        const merged = {
          ...parser,
          async preprocess(text, options) {
            const preprocessText = (await parser.preprocess?.(text, options)) ?? text;
            return (await arraysParser.preprocess?.(preprocessText, options)) ?? preprocessText;
          },
        };
        return [name, merged];
      })
    ),
  },
};

/**
 * JSDoc Prettier configuration.
 *
 * @returns {PrettierConfig} JSDoc Prettier configuration.
 */
export function jsdoc() {
  return {
    plugins: [jsdocWithMultilineArrayPlugin],

    ...jsdocOptions,
    ...multilineArrayOptions,
  };
}
