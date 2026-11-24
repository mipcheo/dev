import { format } from 'prettier';
import { describe, expect, it } from 'vitest';

import { base } from '../src/configs/base.js';
import { jsdoc } from '../src/configs/jsdoc.js';
import { markdown } from '../src/configs/markdown.js';
import { tailwindcss } from '../src/configs/tailwindcss.js';
import { MARKDOWN_FILE_PATTERN } from '../src/constants.js';
import { defineConfig } from '../src/index.js';

describe('defineConfig', () => {
  it('gives an empty plugin list when nothing is merged', () => {
    expect(defineConfig()).toEqual({});
    expect(defineConfig({})).toEqual({ plugins: [] });
  });

  it('joins the plugins of every configuration, in order', () => {
    const config = defineConfig({ plugins: ['first'] }, { plugins: ['second', 'third'] });

    expect(config.plugins).toEqual(['first', 'second', 'third']);
  });

  it('lets a later configuration win an option', () => {
    const config = defineConfig({ semi: true, tabWidth: 2 }, { semi: false });

    expect(config).toMatchObject({ semi: false, tabWidth: 2 });
  });

  it('does not change the configurations it merges', () => {
    const first = { plugins: ['first'], semi: true };
    defineConfig(first, { plugins: ['second'] });

    expect(first).toEqual({ plugins: ['first'], semi: true });
  });
});

describe('base', () => {
  it('sets the shared options', () => {
    expect(base()).toMatchObject({
      printWidth: 160,
      singleQuote: true,
      semi: true,
      tabWidth: 2,
      trailingComma: 'es5',
      endOfLine: 'lf',
      quoteProps: 'consistent',
      singleAttributePerLine: true,
    });
  });

  it('returns a new object on every call', () => {
    expect(base()).not.toBe(base());
  });

  it('formats with single quotes, semicolons and two spaces', async () => {
    const output = await format('const greeting = "hello"\nif (greeting) { console.log(greeting) }', { ...base(), parser: 'babel' });

    expect(output).toBe("const greeting = 'hello';\nif (greeting) {\n  console.log(greeting);\n}\n");
  });
});

describe('jsdoc', () => {
  it('adds one plugin and the JSDoc options', () => {
    const config = jsdoc();

    expect(config.plugins).toHaveLength(1);
    expect(config).toMatchObject({
      tsdoc: true,
      jsdocDescriptionWithDot: true,
      jsdocSeparateReturnsFromParam: true,
      multilineArraysWrapThreshold: 3,
    });
  });

  it('ends a JSDoc description with a dot', async () => {
    const output = await format('/**\n * Adds two numbers\n * @param {number} first the first\n */\nfunction add(first) {}\n', {
      ...defineConfig(base(), jsdoc()),
      parser: 'babel',
    });

    expect(output).toContain('Adds two numbers.');
  });
});

describe('markdown', () => {
  it('applies the Markdown options to Markdown files only', () => {
    const config = markdown();

    expect(config.plugins).toEqual(['prettier-plugin-markdown-compact-tables']);
    expect(config.overrides).toEqual([{ files: [MARKDOWN_FILE_PATTERN], options: { printWidth: Infinity, proseWrap: 'never' } }]);
  });

  it('keeps a long paragraph on one line', async () => {
    const paragraph = Array.from({ length: 60 }, () => 'word').join(' ');
    const output = await format(`${paragraph}\n`, { ...defineConfig(base(), markdown()), filepath: 'README.md' });

    expect(output).toBe(`${paragraph}\n`);
  });
});

describe('tailwindcss', () => {
  it('adds the Tailwind CSS plugin and points at the stylesheet it is given', () => {
    const config = tailwindcss({ stylesheetPath: './src/app.css' });

    expect(config.plugins).toEqual(['prettier-plugin-tailwindcss']);
    expect(config).toMatchObject({
      tailwindStylesheet: './src/app.css',
      tailwindAttributes: ['className', '/.+ClassName/'],
      tailwindFunctions: ['cn', 'cva', 'tw'],
    });
  });
});
