/** @import {Linter as LinterType} from 'eslint' */

import path from 'node:path';
import { ESLint, Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

import { base } from '../../src/configs/base.js';
import { jsdoc } from '../../src/configs/jsdoc.js';
import { nextjs } from '../../src/configs/nextjs.js';
import { prettier } from '../../src/configs/prettier.js';
import { react } from '../../src/configs/react.js';
import { storybook } from '../../src/configs/storybook.js';
import { stylistic } from '../../src/configs/stylistic.js';
import { JS_FILE_PATTERN, TS_FILE_PATTERN } from '../../src/constants.js';
import { defineConfig } from '../../src/index.js';
import projectPlugin from '../../src/plugin.js';

const PACKAGE_DIR = path.resolve(import.meta.dirname, '../..');
const ROOT_DIR = path.resolve(PACKAGE_DIR, '../..');

/**
 * Merges the rules every entry of a configuration sets, the later entry winning as ESLint does.
 *
 * @param {LinterType.Config[]} configs The configuration.
 *
 * @returns {Record<string, unknown>} The rules, by name.
 */
function collectRules(configs) {
  /** @type {Record<string, unknown>} */
  const rules = {};
  for (const config of configs) {
    Object.assign(rules, config.rules);
  }

  return rules;
}

/**
 * Lists the ignore patterns of the entries that only ignore.
 *
 * @param {LinterType.Config[]} configs The configuration.
 *
 * @returns {string[]} The global ignore patterns.
 */
function collectGlobalIgnores(configs) {
  return configs.filter((config) => Object.keys(config).every((key) => key === 'ignores' || key === 'name')).flatMap((config) => config.ignores ?? []);
}

describe('defineConfig', () => {
  it('flattens nested configurations', () => {
    const configs = defineConfig([{ rules: { curly: 'error' } }], { rules: { eqeqeq: 'error' } });

    expect(configs).toHaveLength(2);
  });
});

describe('plugin', () => {
  it('exposes its rules under the project namespace', () => {
    expect(projectPlugin.meta?.namespace).toBe('project');
    expect(Object.keys(projectPlugin.rules ?? {})).toEqual(['max-definition-params', 'module-path-style']);
  });
});

describe('base', () => {
  const configs = base({
    rootDir: ROOT_DIR,
    projectDir: PACKAGE_DIR,
    sourceType: 'module',
    globals: ['node'],
  });
  const rules = collectRules(configs);

  it('ignores build output and the extra patterns it is given', () => {
    const withExtra = base({ rootDir: ROOT_DIR, sourceType: 'module', ignores: ['generated/**'] });

    expect(collectGlobalIgnores(withExtra)).toEqual([
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      'generated/**',
    ]);
  });

  it('turns on the rules of the project plugin', () => {
    expect(rules['project/max-definition-params']).toBe('error');
    expect(rules['project/module-path-style']).toBe('error');
    expect(rules['max-params']).toBe('off');
  });

  it('sets the source type and the globals it is given', () => {
    const own = configs.find((config) => config.languageOptions?.['globals'] !== undefined && config.plugins?.['project'] !== undefined);

    expect(own?.languageOptions?.['sourceType']).toBe('module');
    expect(own?.languageOptions?.['globals']).toHaveProperty('process');
  });

  it('reads the project from the project folder, or the root folder when none is given', () => {
    const withoutProject = base({ rootDir: ROOT_DIR, sourceType: 'commonjs' });
    const own = withoutProject.find((config) => config.languageOptions?.['parserOptions'] !== undefined);

    expect(own?.languageOptions?.['parserOptions']).toHaveProperty('tsconfigRootDir', ROOT_DIR);
  });

  it('restricts imports only when patterns are given', () => {
    expect(rules['no-restricted-imports']).toBeUndefined();

    const restricted = collectRules(
      base({ rootDir: ROOT_DIR, sourceType: 'module', restrictedImports: [{ group: ['lodash'], message: 'Use the standard library.' }] })
    );

    expect(restricted['no-restricted-imports']).toEqual(['error', { patterns: [{ group: ['lodash'], message: 'Use the standard library.' }] }]);
  });

  it('does not ask JavaScript files for return types', () => {
    const javascriptOnly = configs.at(-1);

    expect(javascriptOnly?.files).toEqual([JS_FILE_PATTERN]);
    expect(javascriptOnly?.rules?.['@typescript-eslint/explicit-function-return-type']).toBe('off');
  });
});

describe('jsdoc', () => {
  it('has one entry for JavaScript and one for TypeScript', () => {
    const configs = jsdoc();
    const files = configs.map((config) => config.files);

    expect(files).toContainEqual([JS_FILE_PATTERN]);
    expect(files).toContainEqual([TS_FILE_PATTERN]);
    expect(collectRules(configs)['jsdoc/require-jsdoc']).toBeDefined();
  });
});

describe('prettier', () => {
  it('runs Prettier as a rule', () => {
    expect(collectRules(prettier())['prettier/prettier']).toBe('error');
  });
});

describe('react', () => {
  it('turns on React, its hooks and JSX accessibility', () => {
    const rules = collectRules(react());

    expect(rules['react/prop-types']).toEqual(['error', { skipUndeclared: true }]);
    expect(rules['react-hooks/rules-of-hooks']).toBeDefined();
    expect(rules['jsx-a11y/alt-text']).toBeDefined();
  });
});

describe('storybook', () => {
  const linter = new Linter();
  const configs = storybook();

  /**
   * Lints a file with the Storybook configuration alone.
   *
   * @param {string} code The file's text.
   * @param {string} filename The file's path, from the package folder.
   *
   * @returns {string[]} The rule of each problem, or the message of a problem no rule reports, such as a parsing error.
   */
  function lint(code, filename) {
    return linter.verify(code, configs, { filename: path.join(PACKAGE_DIR, filename) }).map((message) => message.ruleId ?? message.message);
  }

  it('lets Storybook files import dev dependencies', () => {
    const storybookOwn = configs.find((config) => (config.files ?? []).some((pattern) => typeof pattern === 'string' && pattern.startsWith('.storybook/')));

    expect(storybookOwn?.rules?.['import-x/no-extraneous-dependencies']).toBe('off');
  });

  it('accepts a story file that follows the Storybook rules', () => {
    expect(lint("export default { title: 'Button' };\nexport const Primary = {};", 'src/button.stories.js')).toEqual([]);
  });

  it('reports a story file without a default export', () => {
    expect(lint('export const Primary = {};', 'src/button.stories.js')).toContain('storybook/default-exports');
  });

  it('reports a story whose name is not in PascalCase', () => {
    expect(lint("export default { title: 'Button' };\nexport const primary_story = {};", 'src/button.stories.js')).toContain('storybook/prefer-pascal-case');
  });

  it('leaves a file that is no story alone', () => {
    expect(lint('export const primary_story = {};', 'src/button.js')).toEqual([]);
  });

  it('parses MDX files', () => {
    expect(lint('# Title\n\n<Button />\n', 'docs/page.mdx')).toEqual([]);

    const [problem] = lint('# Title\n\n<Button\n', 'docs/page.mdx');

    expect(problem).toMatch(/^(Parsing|Preprocessing) error/);
  });

  it('lints the code blocks of Markdown files', () => {
    expect(lint('# Title\n\n```js\nconst value = 1;\n```\n', 'docs/guide.md')).toEqual([]);

    const [problem] = lint('# Title\n\n```js\nconst = ;\n```\n', 'docs/guide.md');

    expect(problem).toMatch(/^(Parsing|Preprocessing) error/);
  });

  it('lints code blocks without the type information they cannot have, next to base()', async () => {
    const eslint = new ESLint({
      cwd: PACKAGE_DIR,
      overrideConfigFile: true,
      overrideConfig: [...base({ rootDir: ROOT_DIR, projectDir: PACKAGE_DIR, sourceType: 'module' }), ...configs],
    });
    const [result] = await eslint.lintText('# Title\n\n```js\nconst value = 1;\nexport default value;\n```\n', {
      filePath: path.join(PACKAGE_DIR, 'docs/guide.md'),
    });

    expect(result?.messages.map((message) => message.message)).toEqual([]);
  }, 120_000);
});

describe('stylistic', () => {
  it('treats the given namespace as internal when sorting imports', () => {
    const rules = collectRules(stylistic({ namespace: 'mipcheo' }));

    expect(rules['perfectionist/sort-imports']).toEqual(['error', expect.objectContaining({ internalPattern: ['^@mipcheo/'] })]);
    expect(rules['curly']).toEqual(['error', 'all']);
  });
});

describe('nextjs', () => {
  const linter = new Linter();
  const configs = nextjs({ projectDir: PACKAGE_DIR });

  it('ignores the Next.js build output', () => {
    expect(collectGlobalIgnores(configs)).toEqual(['**/.next/**', '**/next-env.d.ts']);
  });

  it('reports an action file without "use server"', () => {
    const messages = linter.verify('export async function save() {}', configs, { filename: path.join(PACKAGE_DIR, 'app/save.action.js') });

    expect(messages.map((message) => message.ruleId)).toContain('no-restricted-syntax');
  });

  it('accepts an action file that starts with "use server"', () => {
    const messages = linter.verify("'use server';\nexport async function save() {}", configs, { filename: path.join(PACKAGE_DIR, 'app/save.action.js') });

    expect(messages.filter((message) => message.ruleId === 'no-restricted-syntax')).toEqual([]);
  });

  it('leaves a file that is no action alone', () => {
    const messages = linter.verify('export async function save() {}', configs, { filename: path.join(PACKAGE_DIR, 'app/save.js') });

    expect(messages.filter((message) => message.ruleId === 'no-restricted-syntax')).toEqual([]);
  });
});

describe('the configurations together', () => {
  it('lint the sources of this package without a problem', async () => {
    const eslint = new ESLint({ cwd: PACKAGE_DIR });
    const results = await eslint.lintFiles(['src/**/*.js']);
    const problems = results.flatMap((result) => result.messages.map((message) => `${result.filePath}: ${message.ruleId ?? ''} ${message.message}`));

    expect(results.length).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  }, 120_000);
});
