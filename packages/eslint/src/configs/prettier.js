/** @import {Linter} from 'eslint' */

import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

/**
 * Prettier ESLint configuration: runs Prettier as a rule and disables the formatting rules it conflicts with. Added before `stylistic()`, which turns the
 * layout rules it keeps back on.
 *
 * @returns {Linter.Config[]} Prettier ESLint configuration.
 */
export function prettier() {
  return defineConfig(prettierPlugin);
}
