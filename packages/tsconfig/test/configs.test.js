import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const SOURCE_DIR = path.resolve(import.meta.dirname, '../src');
const CONFIG_NAMES = fs.readdirSync(SOURCE_DIR).filter((name) => name.endsWith('.json'));
const PACKAGE = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../package.json'), 'utf8'));

/**
 * Reads a configuration the way TypeScript does, following `extends`.
 *
 * @param {string} name The file name of the configuration, in `src`.
 *
 * @returns {ts.ParsedCommandLine} The parsed configuration.
 */
function parse(name) {
  const configPath = path.join(SOURCE_DIR, name);
  const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
  if (error) {
    throw new Error(ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  }

  return ts.parseJsonConfigFileContent(config, ts.sys, SOURCE_DIR, undefined, configPath);
}

/**
 * The diagnostics about the options themselves; a configuration with no `include` finds no input, which is no fault of the configuration.
 *
 * @param {ts.ParsedCommandLine} parsed The parsed configuration.
 *
 * @returns {string[]} The messages.
 */
function optionErrors(parsed) {
  const NO_INPUTS = 18_003;
  return parsed.errors.filter((diagnostic) => diagnostic.code !== NO_INPUTS).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
}

describe('the package', () => {
  it('exports every configuration', () => {
    expect(PACKAGE.exports).toEqual({ './*.json': './src/*.json' });
    expect(CONFIG_NAMES.toSorted()).toEqual([
      'base.json',
      'nestjs.json',
      'nextjs.json',
      'react.json',
      'typescript.json',
    ]);
  });
});

describe.each(CONFIG_NAMES)('%s', (name) => {
  const parsed = parse(name);

  it('is read by TypeScript without an error', () => {
    expect(optionErrors(parsed)).toEqual([]);
  });

  it('is strict and emits nothing', () => {
    expect(parsed.options.strict).toBe(true);
    expect(parsed.options.noUncheckedIndexedAccess).toBe(true);
    expect(parsed.options.noEmit).toBe(true);
    expect(parsed.options.verbatimModuleSyntax).toBe(true);
  });

  it('targets ES modules resolved as a bundler does', () => {
    expect(parsed.options.module).toBe(ts.ModuleKind.ESNext);
    expect(parsed.options.moduleResolution).toBe(ts.ModuleResolutionKind.Bundler);
  });
});

describe('base.json', () => {
  it('is not incremental and knows only Node.js types', () => {
    const { options } = parse('base.json');

    expect(options.incremental).toBe(false);
    expect(options.types).toEqual(['node']);
    expect(options.lib).toEqual(['lib.esnext.d.ts']);
  });
});

describe.each([
  'nestjs.json',
  'react.json',
  'typescript.json',
  'nextjs.json',
])('%s', (name) => {
  it('is incremental and knows the Vite client types', () => {
    const { options } = parse(name);

    expect(options.incremental).toBe(true);
    expect(options.types).toEqual(['node', 'vite/client']);
  });
});

describe.each(['react.json', 'typescript.json'])('%s', (name) => {
  it('has the DOM and leaves JSX as it is', () => {
    const { options } = parse(name);

    expect(options.lib).toContain('lib.dom.d.ts');
    expect(options.jsx).toBe(ts.JsxEmit.Preserve);
  });
});

describe('nextjs.json', () => {
  it('builds on react.json with the Next.js plugin and the JSX runtime', () => {
    const { options } = parse('nextjs.json');

    expect(options.lib).toContain('lib.dom.d.ts');
    expect(options.jsx).toBe(ts.JsxEmit.ReactJSX);
    expect(options.plugins).toEqual([{ name: 'next' }]);
  });
});
