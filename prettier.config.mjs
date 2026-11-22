import { defineConfig } from '@mipcheo/prettier';
import { base } from '@mipcheo/prettier/base';
import { jsdoc } from '@mipcheo/prettier/jsdoc';
import { markdown } from '@mipcheo/prettier/markdown';

/** Prettier configuration. */
const config = defineConfig(base(), jsdoc(), markdown());

export default config;
