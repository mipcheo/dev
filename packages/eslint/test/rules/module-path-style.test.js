import path from 'node:path';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';

import modulePathStyle from '../../src/rules/module-path-style.js';

// The rule reads the aliases from the program of the linted file, so each case names a file of a fixture project that is on disk.
const FIXTURES = path.join(import.meta.dirname, '../fixtures/module-path-style');
const ENTRY = path.join(FIXTURES, 'aliased/src/main.ts');
const CONFIG_FILE = path.join(FIXTURES, 'aliased/src/config/config.ts');
const WATCHER_FILE = path.join(FIXTURES, 'aliased/src/watcher/watcher.ts');
const TEST_FILE = path.join(FIXTURES, 'aliased/test/unit.ts');
const PLAIN_FILE = path.join(FIXTURES, 'plain/src/deep/file.ts');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: FIXTURES,
    },
  },
});

ruleTester.run('module-path-style', modulePathStyle, {
  valid: [
    {
      name: 'a relative path to a module beneath the file',
      filename: ENTRY,
      code: "import { readConfig } from './config';",
    },
    {
      name: 'a relative path to a file beside it',
      filename: CONFIG_FILE,
      code: "export { LIMIT } from './constants';",
    },
    {
      name: 'the alias where the path would climb',
      filename: WATCHER_FILE,
      code: "import { readConfig } from '@scope/app/config';",
    },
    {
      name: 'the alias from a file outside the aliased folder',
      filename: TEST_FILE,
      code: "import { readConfig } from '@scope/app/config';",
    },
    {
      name: 'a climb to a place no alias covers',
      filename: TEST_FILE,
      code: "import { helper } from '../helpers';",
    },
    {
      name: 'a builtin and another package',
      filename: ENTRY,
      code: "import path from 'node:path';\nimport { other } from '@scope/other/config';",
    },
    {
      name: 'a module path that is not written out',
      filename: WATCHER_FILE,
      code: 'export const load = async (name: string) => await import(name);',
    },
    {
      name: 'a climb in a project that has no alias',
      filename: PLAIN_FILE,
      code: "import { other } from '../other';",
    },
  ],

  invalid: [
    {
      name: 'import: the alias to a module beneath the file',
      filename: ENTRY,
      code: "import { readConfig } from '@scope/app/config';",
      output: "import { readConfig } from './config';",
      errors: [{ messageId: 'relative', data: { specifier: '@scope/app/config', replacement: './config' } }],
    },
    {
      name: 'import type: the alias to a file beside it',
      filename: CONFIG_FILE,
      code: "import type { IConfig } from '@scope/app/config/types';",
      output: "import type { IConfig } from './types';",
      errors: [{ messageId: 'relative' }],
    },
    {
      name: 'export from: the alias to a module beneath the file',
      filename: ENTRY,
      code: "export { readConfig } from '@scope/app/config';",
      output: "export { readConfig } from './config';",
      errors: [{ messageId: 'relative' }],
    },
    {
      name: 'export all: the alias to a file beneath the file',
      filename: ENTRY,
      code: "export * from '@scope/app/config/types';",
      output: "export * from './config/types';",
      errors: [{ messageId: 'relative' }],
    },
    {
      name: 'import(): the alias to a module beneath the file',
      filename: ENTRY,
      code: "export const load = async () => await import('@scope/app/config');",
      output: "export const load = async () => await import('./config');",
      errors: [{ messageId: 'relative' }],
    },
    {
      name: 'the alias to the folder the file is in',
      filename: CONFIG_FILE,
      code: "import { readConfig } from '@scope/app/config';",
      output: "import { readConfig } from '.';",
      errors: [{ messageId: 'relative' }],
    },
    {
      name: 'import: a climbing path',
      filename: WATCHER_FILE,
      code: "import { readConfig } from '../config';",
      output: "import { readConfig } from '@scope/app/config';",
      errors: [{ messageId: 'alias', data: { specifier: '../config', replacement: '@scope/app/config' } }],
    },
    {
      name: 'export from: a climbing path',
      filename: WATCHER_FILE,
      code: "export type { ILogger } from '../logger/types';",
      output: "export type { ILogger } from '@scope/app/logger/types';",
      errors: [{ messageId: 'alias' }],
    },
    {
      name: 'export all: a climbing path, from outside the aliased folder',
      filename: TEST_FILE,
      code: "export * from '../src/logger';",
      output: "export * from '@scope/app/logger';",
      errors: [{ messageId: 'alias' }],
    },
    {
      name: 'a climbing path two aliases cover takes the alias of the deeper folder',
      filename: WATCHER_FILE,
      code: "import type { IConfig } from '../config/types';",
      output: "import type { IConfig } from '@config/types';",
      errors: [{ messageId: 'alias' }],
    },
    {
      name: 'the quotes of the path are kept',
      filename: ENTRY,
      code: 'import { readConfig } from "@config/schemas";',
      output: 'import { readConfig } from "./config/schemas";',
      errors: [{ messageId: 'relative' }],
    },
  ],
});
