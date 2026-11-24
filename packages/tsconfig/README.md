# @mipcheo/tsconfig

Shared `tsconfig` files to extend.

## Installation

```sh
pnpm add -D @mipcheo/tsconfig typescript @types/node
```

`typescript` can be TypeScript 6 or 7. With `@mipcheo/eslint`, install TypeScript 6 as `typescript` and TypeScript 7 as `@typescript/native` (for a fast `tsc`):

```sh
pnpm add -D typescript@npm:@typescript/typescript6 @typescript/native@npm:typescript
```

## Usage

```json
{
  "extends": "@mipcheo/tsconfig/base.json",
  "include": ["./src/**/*"]
}
```

## Running TypeScript directly

`base.json` emits nothing, so use `oxnode` from `@oxc-node/cli` to run `.ts` files without building:

```sh
pnpm add -D @oxc-node/cli
```

```sh
pnpm oxnode ./src/index.ts
pnpm oxnode watch ./src/index.ts
```

`watch` reruns when a file changes. `oxnode` reads your `tsconfig.json`, so `paths` aliases, `.ts` imports and decorators work. It does not check types: run `tsc` for that.

## Configs

| File | Extends | For |
| --- | --- | --- |
| [`base.json`](#basejson) | — | Libraries and Node.js scripts. |
| [`typescript.json`](#typescriptjson) | `base.json` | Browser projects built with Vite. |
| [`react.json`](#reactjson) | `base.json` | React apps built with Vite. |
| [`nextjs.json`](#nextjsjson) | `react.json` | Next.js apps. |
| [`nestjs.json`](#nestjsjson) | `base.json` | NestJS apps built with Vite. |

All except `base.json` load the `vite/client` types, so the project needs `vite`.

### `base.json`

Strict checking, no output: `tsc` only checks, a bundler runs the code.

#### Language

| Option | Value | Effect |
| --- | --- | --- |
| `incremental` | `false` | No `.tsbuildinfo` file. |
| `target` | `"esnext"` | Keep modern syntax. |
| `module` | `"esnext"` | ES modules. |
| `moduleResolution` | `"bundler"` | Resolve imports like Vite. |
| `lib` | `["ESNext"]` | No DOM types. |
| `types` | `["node"]` | Node.js types only. |
| `moduleDetection` | `"force"` | Every file is a module. |
| `allowJs` | `true` | Include JavaScript files. |
| `allowArbitraryExtensions` | `true` | Import files like `.css` that have a `.d.css.ts`. |
| `allowImportingTsExtensions` | `true` | Imports may end in `.ts`. |
| `rewriteRelativeImportExtensions` | `true` | `.ts` imports become `.js` when emitted. |
| `allowSyntheticDefaultImports`, `esModuleInterop` | `true` | Default-import CommonJS packages. |
| `allowUmdGlobalAccess` | `false` | UMD globals must be imported. |
| `experimentalDecorators`, `emitDecoratorMetadata` | `true` | Decorators, as NestJS uses them. |
| `forceConsistentCasingInFileNames` | `true` | Import casing must match the file. |
| `isolatedModules` | `true` | Each file compiles on its own. |
| `verbatimModuleSyntax` | `true` | Type-only imports need `import type`. |
| `noResolve` | `false` | Imported files join the program. |
| `resolveJsonModule` | `true` | Import `.json` files. |
| `resolvePackageJsonExports`, `resolvePackageJsonImports` | `true` | Honour `exports` and `imports` in `package.json`. |
| `useDefineForClassFields` | `true` | Standard class fields. |

#### Output

| Option | Value | Effect |
| --- | --- | --- |
| `noEmit` | `true` | Check only. Set `false` to emit. |
| `emitDeclarationOnly` | `true` | When emitting, only `.d.ts`. |
| `declaration`, `declarationMap` | `true` | `.d.ts` files with source maps. |
| `sourceMap` | `true` | Source maps for JavaScript. |
| `inlineSourceMap`, `inlineSources` | `false` | Source maps in separate files. |
| `importHelpers` | `true` | Helpers come from `tslib`. |
| `noEmitHelpers` | `true` | No helpers written into the output. |
| `noEmitOnError` | `true` | Emit nothing on a type error. |
| `preserveConstEnums` | `true` | Keep `const enum`s. |
| `removeComments` | `false` | Keep comments. |
| `stripInternal` | `true` | Leave `@internal` out of `.d.ts`. |
| `emitBOM` | `false` | No byte-order mark. |
| `newLine` | `"lf"` | `\n` line endings. |

#### Type checking

| Option | Value | Effect |
| --- | --- | --- |
| `strict` | `true` | Turn on all the strict checks below. |
| `strictNullChecks` | `true` | `null` and `undefined` must be handled. |
| `strictFunctionTypes` | `true` | Function parameters are checked strictly. |
| `strictBindCallApply` | `true` | `bind`, `call` and `apply` are type-checked. |
| `strictPropertyInitialization` | `true` | Class fields must be set in the constructor. |
| `strictBuiltinIteratorReturn` | `true` | Built-in iterators return `undefined`, not `any`. |
| `noImplicitAny` | `true` | No hidden `any` types. |
| `noImplicitThis` | `true` | `this` must have a known type. |
| `alwaysStrict` | `true` | Emit `"use strict"`. |
| `useUnknownInCatchVariables` | `true` | A caught error is `unknown`. |
| `checkJs` | `true` | Check JavaScript, with types from JSDoc. |
| `noUncheckedIndexedAccess` | `true` | `array[i]` may be `undefined`. |
| `noPropertyAccessFromIndexSignature` | `true` | Index-signature keys read as `obj['key']`. |
| `noImplicitOverride` | `true` | Overrides need `override`. |
| `noImplicitReturns` | `true` | Every code path returns. |
| `noFallthroughCasesInSwitch` | `true` | No fall-through between `case`s. |
| `noUncheckedSideEffectImports` | `true` | `import './setup'` must resolve. |
| `noUnusedLocals` | `true` | Unused variables are errors. |
| `noUnusedParameters` | `false` | Left to ESLint. |
| `allowUnreachableCode` | `false` | Unreachable code is an error. |
| `allowUnusedLabels` | `false` | Unused labels are errors. |
| `skipLibCheck` | `true` | Skip dependencies' `.d.ts`. |

### `typescript.json`

| Option | Value | Effect |
| --- | --- | --- |
| `incremental` | `true` | Faster rebuilds. |
| `types` | `["node", "vite/client"]` | Add Vite types. |
| `lib` | `ESNext`, `DOM`, `WebWorker` and their iterables | Browser and worker APIs. |
| `jsx` | `"preserve"` | Leave JSX to the bundler. |

### `react.json`

| Option | Value | Effect |
| --- | --- | --- |
| `incremental` | `true` | Faster rebuilds. |
| `types` | `["node", "vite/client"]` | Add Vite types. |
| `lib` | `ESNext`, `DOM`, `WebWorker` and their iterables | Browser and worker APIs. |
| `jsx` | `"preserve"` | Leave JSX to Vite. |

### `nextjs.json`

Everything in `react.json`, plus:

| Option | Value | Effect |
| --- | --- | --- |
| `plugins` | `[{ "name": "next" }]` | Next.js checks in the editor. |
| `jsx` | `"react-jsx"` | Automatic React JSX runtime. |

### `nestjs.json`

| Option | Value | Effect |
| --- | --- | --- |
| `incremental` | `true` | Faster rebuilds. |
| `types` | `["node", "vite/client"]` | Add Vite types. |

## Development

```sh
pnpm test
```
