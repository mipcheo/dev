# @mipcheo/eslint

Shared ESLint flat configurations, split into seven blocks a project combines to fit its stack, with a plugin of custom rules.

## Installation

```powershell
pnpm add -D @mipcheo/eslint
```

The package brings `eslint`, `typescript-eslint` and every plugin it needs.

## Usage

```js
// eslint.config.mjs
import path from 'node:path';

import { defineConfig } from '@mipcheo/eslint';
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
  }),
  jsdoc(),
  prettier(),
  stylistic({ namespace: 'mipcheo' })
);

export default config;
```

Order matters: `base()` comes first, and `prettier()` comes before `stylistic()` (Prettier's config turns the formatting rules off, and `stylistic()` turns the layout rules it keeps back on). Add `react()`, `nextjs()` and `storybook()` after `base()` where the project has that stack.

`defineConfig(...configs)`, exported from `@mipcheo/eslint`, is the `defineConfig` of `eslint/config`.

## Configurations

| Import | Function | For |
| --- | --- | --- |
| `@mipcheo/eslint/base` | [`base(options)`](#baseoptions) | Every project. |
| `@mipcheo/eslint/jsdoc` | [`jsdoc()`](#jsdoc) | Projects that document their public API. |
| `@mipcheo/eslint/prettier` | [`prettier()`](#prettier) | Projects formatted with Prettier. |
| `@mipcheo/eslint/stylistic` | [`stylistic(options)`](#stylisticoptions) | Projects formatted with Prettier, after `prettier()`. |
| `@mipcheo/eslint/react` | [`react()`](#react) | React apps and libraries. |
| `@mipcheo/eslint/nextjs` | [`nextjs(options)`](#nextjsoptions) | Next.js apps, with `react()`. |
| `@mipcheo/eslint/storybook` | [`storybook()`](#storybook) | Projects with Storybook. |

### `base(options)`

The rules every TypeScript and JavaScript file is held to: correctness, type safety (with type information from the project's `tsconfig.json`), naming, file names, and imports. It ignores `node_modules`, `dist`, `build` and `out`, and turns on the rules of the [`project` plugin](#the-project-plugin).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | (required) | The repository root, where the root `package.json` is. |
| `projectDir` | `string` | `rootDir` | The project folder: where its `tsconfig.json` and `package.json` are. Imports must be declared in the root or the project `package.json`. |
| `sourceType` | `'module' \| 'commonjs'` | (required) | Whether the code uses ES modules or CommonJS. |
| `globals` | `(keyof globals)[]` | `[]` | Global variables to allow, by the name of a set in the `globals` package, such as `'node'`, `'browser'` or `'nodeBuiltin'`. |
| `ignores` | `string[]` | `[]` | More glob patterns to ignore. |
| `restrictedImports` | `RestrictedImport[]` | `[]` | Imports to forbid, each `{ group, message }` or `{ regex, message }`; the message is shown when one is used. |

```js
base({
  rootDir: path.resolve(import.meta.dirname, '../../'),
  projectDir: import.meta.dirname,
  sourceType: 'module',
  globals: ['nodeBuiltin'],
  ignores: ['generated/**'],
  restrictedImports: [{ group: ['lodash'], message: 'Use the standard library instead.' }],
});
```

### `jsdoc()`

Requires JSDoc on the public API (exported functions, classes, types and variables), and checks that it matches the code. In JavaScript files the types come from JSDoc; in TypeScript files they come from the code.

No options.

### `prettier()`

Runs Prettier as an ESLint rule, so formatting problems are reported and fixed by `eslint --fix`, and turns off the ESLint rules that conflict with Prettier. Prettier reads the project's own Prettier config.

No options.

### `stylistic(options)`

The layout rules Prettier leaves open (braces, blank lines, comment placement, short names), and the order of imports, exports and declarations. Add it after `prettier()`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `namespace` | `string` | `''` | The scope of the workspace's own packages: imports starting with `@<namespace>/` are grouped as internal, after external packages. |

### `react()`

React, its hooks, fast refresh, and JSX accessibility, for React 19 with the automatic JSX runtime.

No options.

### `nextjs(options)`

The Next.js rules, including Core Web Vitals, and a check that every `*.action.*` file starts with `'use server'`. It ignores `.next` and `next-env.d.ts`. Add it with `react()`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `projectDir` | `string` | (required) | The root folder of the Next.js app. |

### `storybook()`

The Storybook rules for stories and for `.storybook/main.*`, linting of `.md` and `.mdx` files and the code blocks in them, and permission for files in `.storybook/` to import dev dependencies. Code blocks belong to no TypeScript project, so they are linted without the type-checked rules of `base()`.

No options.

## The `project` plugin

`base()` registers the plugin under the name `project` (source: [`src/plugin.js`](src/plugin.js)) and turns both of its rules on at `error`.

| Rule | Fixable | Needs type information | Options |
| --- | --- | --- | --- |
| [`project/max-definition-params`](#projectmax-definition-params) | No | No | `{ max }` |
| [`project/module-path-style`](#projectmodule-path-style) | Yes | Yes | — |

### `project/max-definition-params`

**Purpose**: keep function signatures short. A function you define with many positional parameters is hard to call correctly, so past the limit it should take an options object instead.

It replaces ESLint's `max-params` (which `base()` turns off), because `max-params` also counts callbacks. A callback's parameters are decided by the API that calls it (`reduce`, `addEventListener`, a library hook), so you can neither shorten it nor turn it into an options object.

| Function | Counted |
| --- | --- |
| A function declaration, function expression or arrow function | Yes |
| A class or object method | Yes |
| A TypeScript `declare function` | Yes |
| A function passed as an argument to a call or `new`, even nested inside an object or array argument | No |
| A function defined inside the body of such a callback | Yes: the search for an enclosing call stops at the nearest function |
| A function called where it is defined, `(function (a, b, c, d) {})()` | Yes: it is the callee, not an argument |

```js
function open(first, second, third, fourth) {} // error: 4 parameters, maximum allowed is 3
function open({ first, second, third, fourth }) {} // valid: one options object

items.reduce((total, item, index, all) => total, 0); // valid: a callback
register({ handler: (first, second, third, fourth) => first }); // valid: inside an argument
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `integer` (≥ 0) | `3` | The most parameters a definition may have. |

```js
rules: {
  'project/max-definition-params': ['error', { max: 4 }],
}
```

### `project/module-path-style`

**Purpose**: decide between a relative path and the project's alias **by direction**.

- **Going down**, to a module in the file's own folder or beneath it: use a **relative path**. A folder that only reaches into itself this way is self-contained: you can move or rename it, alias included, without touching its inner imports.
- **Going up**, to a module outside the file's folder: use the **alias**. There are no `../../` chains to count, and the path to a shared module is the same from every file, so moving the importing file does not break it.

The rule does not ask for the alias everywhere, or for relative paths everywhere. It rejects the two mixed forms: an alias that points into your own folder, and a `../` that climbs out to a place an alias covers.

The aliases come from `compilerOptions.paths` in the linted file's own `tsconfig.json`. Only an entry that maps `name/*` to exactly one `folder/*` counts. An entry with fallback targets, or without `/*`, is ignored.

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/*"],
      "@config/*": ["./src/config/*"]
    }
  }
}
```

```text
src/
├── main.ts
├── config/
│   ├── index.ts
│   └── types.ts
├── logger/
│   └── index.ts
└── watcher/
    └── watcher.ts
test/
└── unit.ts
```

| File | Written | Result | Why |
| --- | --- | --- | --- |
| `src/main.ts` | `'@app/config'` | Fixed to `'./config'` | The target is beneath the file. |
| `src/config/index.ts` | `'@app/config/types'` | Fixed to `'./types'` | The target is beside the file. |
| `src/config/index.ts` | `'@app/config'` | Fixed to `'.'` | The target is the file's own folder. |
| `src/watcher/watcher.ts` | `'../logger'` | Fixed to `'@app/logger'` | The path climbs out of `src/watcher/`. |
| `src/watcher/watcher.ts` | `'../config/types'` | Fixed to `'@config/types'` | When several aliases cover the target, the one with the deepest folder wins. |
| `test/unit.ts` | `'../src/logger'` | Fixed to `'@app/logger'` | The path climbs out, and `@app` covers the target. |
| `src/watcher/watcher.ts` | `'@app/config'` | Valid | The alias goes up, out of `src/watcher/`. |
| `src/main.ts` | `'./config'` | Valid | A relative path going down. |
| `test/unit.ts` | `'../helpers'` | Valid | No alias covers `helpers/`, so there is nothing better to write. |
| any | `'node:path'`, `'react'` | Valid | Not a path into the project. |

It checks `import`, `import type`, `export … from`, `export * from` and `import()` with a string literal path, keeps the original quotes when fixing, and has no options. It needs type information (`parserOptions.projectService`, which `base()` sets) to read the aliases. In a project without such an alias, it does nothing.

## Development

```powershell
pnpm test    # Vitest
pnpm check   # tsc --noEmit, then eslint
```

Tests live in `test/`: `test/rules/` for the two rules (with `RuleTester` and the sample projects in `test/fixtures/`), and `test/configs/` for the configurations.
