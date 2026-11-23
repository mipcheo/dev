import path from 'node:path';
import { defineConfig } from 'eslint/config';

import { base } from '@mipcheo/eslint/base';
import { jsdoc } from '@mipcheo/eslint/jsdoc';
import { prettier } from '@mipcheo/eslint/prettier';
import { stylistic } from '@mipcheo/eslint/stylistic';

const config = defineConfig(
  base({
    rootDir: path.resolve(import.meta.dirname, '../../'),
    projectDir: import.meta.dirname,
    sourceType: 'module',
    globals: ['nodeBuiltin'],
    ignores: ['test/fixtures/**'],
  }),
  jsdoc(),
  prettier(),
  stylistic({ namespace: 'mipcheo' })
);

export default config;
