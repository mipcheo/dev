# @mipcheo/eslint

Shared ESLint flat configs for TypeScript, React and Next.js. Built for MipCheo projects, and open to anyone. Pick the ones your project needs.

## Installation

```sh
pnpm add -D @mipcheo/eslint eslint typescript@npm:@typescript/typescript6
```

`eslint` and `typescript` come from your project. `typescript` must be TypeScript 6: `typescript-eslint` does not support 7 yet.

Some plugins may warn on install (unsupported ESLint or TypeScript version, deprecated `glob`). It is harmless; to silence it, add to your project:

```yaml
# pnpm-workspace.yaml
overrides:
  eslint: ^10.15.0
  glob: ^14.0.6

peerDependencyRules:
  allowAny:
    - '@typescript/native'
    - eslint
    - typescript
```

| Setting | Effect |
| --- | --- |
| `overrides.eslint` | Every plugin uses this ESLint version. |
| `overrides.glob` | Replaces the deprecated `glob@10`. |
| `peerDependencyRules.allowAny` | No warning when a plugin asks for another version of these. Needed with `strictPeerDependencies: true`, which otherwise fails the install. |

With npm, put the two `overrides` lines under `"overrides"` in `package.json`; npm has no `peerDependencyRules`.

## Usage

```js
// eslint.config.mjs
import path from 'node:path';

import { defineConfig } from '@mipcheo/eslint';
import { base } from '@mipcheo/eslint/base';
import { jsdoc } from '@mipcheo/eslint/jsdoc';
import { prettier } from '@mipcheo/eslint/prettier';
import { stylistic } from '@mipcheo/eslint/stylistic';

export default defineConfig(
  base({
    rootDir: path.resolve(import.meta.dirname, '../../'),
    projectDir: import.meta.dirname,
    sourceType: 'module',
  }),
  jsdoc(),
  prettier(),
  stylistic({ namespace: 'mipcheo' })
);
```

Put `base()` first and `prettier()` before `stylistic()`.

## Configs

| Config | What it does |
| --- | --- |
| [`base(options)`](#baseoptions) | Core rules for JS and TS. |
| [`jsdoc()`](#jsdoc) | Requires JSDoc on exported code. |
| [`prettier()`](#prettier) | Runs Prettier inside ESLint. |
| [`stylistic(options)`](#stylisticoptions) | Layout and import order. |
| [`react()`](#react) | React rules. |
| [`nextjs(options)`](#nextjsoptions) | Next.js rules. |
| [`storybook()`](#storybook) | Storybook and Markdown rules. |

### `base(options)`

Catches bugs, checks types, and enforces naming and clean imports in JS and TS files. Ignores `node_modules`, `dist`, `build` and `out`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | required | Repository root. |
| `projectDir` | `string` | `rootDir` | Folder with the project's `tsconfig.json` and `package.json`. |
| `sourceType` | `'module' \| 'commonjs'` | required | ES modules or CommonJS. |
| `globals` | `string[]` | `[]` | Globals to allow: `'node'`, `'browser'`… |
| `ignores` | `string[]` | `[]` | Extra patterns to ignore. |
| `restrictedImports` | `RestrictedImport[]` | `[]` | Imports to forbid: `{ group, message }` or `{ regex, message }`. |

### `jsdoc()`

Exported functions, classes, types and variables need JSDoc, and it must match the code. No options.

### `prettier()`

Reports Prettier formatting as ESLint errors, so `eslint --fix` also formats. Uses your Prettier config. No options.

### `stylistic(options)`

Braces, blank lines, comments and short names, plus the order of imports and exports. Add it after `prettier()`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | `''` | Your scope. With `'mipcheo'`, `@mipcheo/…` imports are grouped after external ones. |

### `react()`

React, hooks, fast refresh and JSX accessibility, for React 19. No options.

### `nextjs(options)`

Next.js and Core Web Vitals rules. A `*.action.*` file must start with `'use server'`. Use with `react()`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `projectDir` | `string` | required | Root folder of the Next.js app. |

### `storybook()`

Storybook rules for stories and `.storybook/main.*`. Also lints `.md`/`.mdx` files and their code blocks. No options.

## Custom rules

Both are on in `base()`.

### `project/max-definition-params`

A function may have at most 3 parameters; past that, use an options object. Callbacks are not counted, since their caller decides their parameters.

```js
function open(first, second, third, fourth) {} // error
function open({ first, second, third, fourth }) {} // ok
items.reduce((total, item, index, all) => total, 0); // ok: callback
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `integer` | `3` | Maximum parameters. |

### `project/module-path-style`

Going **down** into the file's folder: relative path, so the folder can be moved. Going **up** out of it: alias, so there are no `../../`. Autofixable. No options.

With `"@app/*": ["./src/*"]` in `tsconfig.json`:

| File | Written | Result |
| --- | --- | --- |
| `src/main.ts` | `'@app/config'` | Fixed to `'./config'` |
| `src/watcher/watcher.ts` | `'../logger'` | Fixed to `'@app/logger'` |
| `src/watcher/watcher.ts` | `'@app/config'` | ok |
| `src/main.ts` | `'./config'` | ok |

Only aliases like `"name/*": ["folder/*"]` count. A `../` that no alias covers is left alone.

## Development

```sh
pnpm test
pnpm check
```

## License

[MIT](LICENSE)
