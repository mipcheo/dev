# @mipcheo/tsconfig

Shared base `tsconfig` files for projects to extend: five of them, one per kind of project.

## Installation

```powershell
pnpm add -D @mipcheo/tsconfig
```

The package brings `typescript`.

## Usage

```json
{
  "extends": "@mipcheo/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": ["./src/**/*"]
}
```

None of the files sets `include`, `rootDir` or `paths`: those belong to the project.

## Configurations

| Import | Extends | For |
| --- | --- | --- |
| [`@mipcheo/tsconfig/base.json`](#basejson) | — | Libraries, Node.js scripts and tools. |
| [`@mipcheo/tsconfig/typescript.json`](#typescriptjson) | `base.json` | TypeScript projects that run in the browser, built with Vite. |
| [`@mipcheo/tsconfig/react.json`](#reactjson) | `base.json` | React apps and libraries, built with Vite. |
| [`@mipcheo/tsconfig/nextjs.json`](#nextjsjson) | `react.json` | Next.js apps. |
| [`@mipcheo/tsconfig/nestjs.json`](#nestjsjson) | `base.json` | NestJS apps, built with Vite. |

```text
base.json
├── typescript.json
├── react.json
│   └── nextjs.json
└── nestjs.json
```

### `base.json`

Strict type checking of modern TypeScript and JavaScript, with no output: a bundler or a runner (such as `@oxc-node/cli`) runs the code, and `tsc` only checks it.

**Extends**: nothing.

#### Project and language

| Option | Value | Effect |
| --- | --- | --- |
| `incremental` | `false` | No `.tsbuildinfo` file. |
| `target` | `"esnext"` | Modern syntax is kept as written. |
| `module` | `"esnext"` | ES modules. |
| `moduleResolution` | `"bundler"` | Modules resolve as Vite and other bundlers resolve them: no extension needed, `exports` and `imports` of `package.json` honoured. |
| `lib` | `["ESNext"]` | Only the standard library; no DOM types. |
| `types` | `["node"]` | Only the Node.js global types are loaded. |
| `moduleDetection` | `"force"` | Every file is a module, even without `import` or `export`. |
| `allowJs` | `true` | JavaScript files are part of the program. |
| `allowArbitraryExtensions` | `true` | A file such as `.css` can be imported when a `.d.css.ts` declares it. |
| `allowImportingTsExtensions` | `true` | Imports may name `.ts` files. |
| `rewriteRelativeImportExtensions` | `true` | A relative `.ts` import is written as `.js` in emitted code. |
| `allowSyntheticDefaultImports`, `esModuleInterop` | `true` | A CommonJS package can be imported as a default import. |
| `allowUmdGlobalAccess` | `false` | A UMD global must be imported. |
| `experimentalDecorators`, `emitDecoratorMetadata` | `true` | Legacy decorators with metadata, as NestJS needs. |
| `forceConsistentCasingInFileNames` | `true` | An import's casing must match the file name. |
| `isolatedModules` | `true` | Each file can be transpiled alone. |
| `verbatimModuleSyntax` | `true` | Imports and exports are emitted as written, so a type-only import must say `import type`. |
| `noResolve` | `false` | Imported files are added to the program. |
| `resolveJsonModule` | `true` | `.json` files can be imported. |
| `resolvePackageJsonExports`, `resolvePackageJsonImports` | `true` | The `exports` and `imports` fields of `package.json` are honoured. |
| `useDefineForClassFields` | `true` | Class fields follow the standard semantics. |

#### Output

| Option | Value | Effect |
| --- | --- | --- |
| `noEmit` | `true` | Type-check only. A project that emits sets `noEmit` to `false`, and `emitDeclarationOnly` to `false` if it emits JavaScript too. |
| `emitDeclarationOnly` | `true` | When emitting, only `.d.ts` files. |
| `declaration`, `declarationMap` | `true` | When emitting, `.d.ts` files with maps back to the source. |
| `sourceMap` | `true` | When emitting JavaScript, source maps. |
| `inlineSourceMap`, `inlineSources` | `false` | Source maps are separate files. |
| `importHelpers` | `true` | Helpers are imported from `tslib` rather than inlined. |
| `noEmitHelpers` | `true` | No helper functions are written into the output. |
| `noEmitOnError` | `true` | Nothing is emitted when there is a type error. |
| `preserveConstEnums` | `true` | `const enum` declarations are kept in the output. |
| `removeComments` | `false` | Comments are kept. |
| `stripInternal` | `true` | Declarations marked `@internal` are left out of `.d.ts` files. |
| `emitBOM` | `false` | No byte-order mark. |
| `newLine` | `"lf"` | `\n` line endings. |

#### Type checking

| Option | Value | Effect |
| --- | --- | --- |
| `strict` | `true` | Every strict check: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `strictBuiltinIteratorReturn`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict` and `useUnknownInCatchVariables`, each also set explicitly. |
| `checkJs` | `true` | JavaScript files are type-checked, with types from JSDoc. |
| `noUncheckedIndexedAccess` | `true` | An index access may be `undefined`. |
| `noPropertyAccessFromIndexSignature` | `true` | A key from an index signature is read as `obj['key']`, not `obj.key`. |
| `noImplicitOverride` | `true` | A member that overrides one of its base class says `override`. |
| `noImplicitReturns` | `true` | Every code path of a function that returns a value returns one. |
| `noFallthroughCasesInSwitch` | `true` | A non-empty `case` ends with `break`, `return` or `throw`. |
| `noUncheckedSideEffectImports` | `true` | A side-effect import (`import './setup'`) must resolve. |
| `noUnusedLocals` | `true` | An unused local variable or import is an error. |
| `noUnusedParameters` | `false` | Unused parameters are left to ESLint, which allows a leading `_`. |
| `allowUnreachableCode` | `false` | Unreachable code is an error. |
| `allowUnusedLabels` | `false` | An unused label is an error. |
| `skipLibCheck` | `true` | `.d.ts` files of dependencies are not checked. |

### `typescript.json`

A TypeScript project that runs in the browser or in a worker, built with Vite.

**Extends**: `base.json`.

| Option | Value | Instead of | Effect |
| --- | --- | --- | --- |
| `incremental` | `true` | `false` | Faster rebuilds through a `.tsbuildinfo` file. |
| `types` | `["node", "vite/client"]` | `["node"]` | Vite's client types: `import.meta.env`, asset imports. |
| `lib` | `ESNext`, `DOM`, `DOM.Iterable`, `DOM.AsyncIterable`, `WebWorker`, `WebWorker.AsyncIterable`, `WebWorker.ImportScripts`, `Webworker.Iterable` | `["ESNext"]` | Browser and worker APIs. |
| `jsx` | `"preserve"` | not set | JSX is left for the bundler to transform. |

The project needs `vite` installed, for the `vite/client` types.

### `react.json`

A React app or library, built with Vite.

**Extends**: `base.json`.

| Option | Value | Instead of | Effect |
| --- | --- | --- | --- |
| `incremental` | `true` | `false` | Faster rebuilds through a `.tsbuildinfo` file. |
| `types` | `["node", "vite/client"]` | `["node"]` | Vite's client types: `import.meta.env`, asset imports. |
| `lib` | `ESNext`, `DOM`, `DOM.Iterable`, `DOM.AsyncIterable`, `WebWorker`, `WebWorker.AsyncIterable`, `WebWorker.ImportScripts`, `Webworker.Iterable` | `["ESNext"]` | Browser and worker APIs. |
| `jsx` | `"preserve"` | not set | JSX is left for Vite's React plugin to transform. |

These are the same options as `typescript.json`. The project needs `vite` installed, for the `vite/client` types.

### `nextjs.json`

A Next.js app.

**Extends**: `react.json`.

| Option | Value | Instead of | Effect |
| --- | --- | --- | --- |
| `plugins` | `[{ "name": "next" }]` | not set | The Next.js TypeScript plugin, for Next.js-specific checks in the editor. |
| `jsx` | `"react-jsx"` | `"preserve"` | JSX is type-checked against the automatic React runtime. |

It keeps `types: ["node", "vite/client"]` from `react.json`, so the project needs `vite` installed, or overrides `types`.

### `nestjs.json`

A NestJS app, built with Vite.

**Extends**: `base.json`.

| Option | Value | Instead of | Effect |
| --- | --- | --- | --- |
| `incremental` | `true` | `false` | Faster rebuilds through a `.tsbuildinfo` file. |
| `types` | `["node", "vite/client"]` | `["node"]` | Vite's client types: `import.meta.env`, `import.meta.hot`. |

The decorators NestJS needs (`experimentalDecorators`, `emitDecoratorMetadata`) are already on in `base.json`. The project needs `vite` installed, for the `vite/client` types.

## Development

```powershell
pnpm test
```

The tests in `test/` read each file through the TypeScript API (`readConfigFile` and `parseJsonConfigFileContent`, following `extends`), check that no option is reported as an error, and check the key options.
