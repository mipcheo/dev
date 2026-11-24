# @mipcheo/dev

A monorepo of the shared configurations used by MipCheo projects: ESLint, Prettier and TypeScript. Each package is published on its own, and a project combines the ones its stack needs.

## Packages

| Package | Description |
| --- | --- |
| [`@mipcheo/eslint`](packages/eslint) | ESLint flat configurations in blocks (base, jsdoc, prettier, stylistic, react, nextjs, storybook), with a plugin of custom rules. |
| [`@mipcheo/prettier`](packages/prettier) | Prettier configurations in blocks (base, jsdoc, markdown, tailwindcss), and a `defineConfig` that merges them. |
| [`@mipcheo/tsconfig`](packages/tsconfig) | Base `tsconfig` files: base, typescript, react, nextjs, nestjs. |

## Requirements

- Node.js as pinned in [`.nvmrc`](.nvmrc) (`26.13.1`)
- pnpm as pinned in the `packageManager` field of [`package.json`](package.json)

## Getting started

```powershell
pnpm install
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm format` | Formats the whole repository with Prettier. |
| `pnpm check` | Checks formatting, then runs each package's `check` (typecheck with `tsc --noEmit`, then ESLint). |
| `pnpm test` | Runs each package's tests (Vitest). |
| `pnpm pack` | Packs every package into a tarball in `out/`. |

## Layout

```text
.
├── packages/
│   ├── eslint/      # @mipcheo/eslint
│   ├── prettier/    # @mipcheo/prettier
│   └── tsconfig/    # @mipcheo/tsconfig
├── prettier.config.mjs
├── pnpm-workspace.yaml
└── package.json
```

The repository uses its own packages: the root `prettier.config.mjs` is built from `@mipcheo/prettier`, and each package has an `eslint.config.mjs` built from `@mipcheo/eslint` and a `tsconfig.json` that extends `@mipcheo/tsconfig/base.json`.

## Workspace conventions

These are set in [`pnpm-workspace.yaml`](pnpm-workspace.yaml):

- **Strict catalog** (`catalogMode: strict`): every direct dependency's exact version lives in `catalog`, and each package's `package.json` says `"catalog:"`. To add or upgrade a dependency, edit `pnpm-workspace.yaml`.
- **`nodeLinker: hoisted`**: one flat `node_modules` at the root.
- **Strict peer dependencies**: an unmet peer dependency fails the install, except for `eslint` and `typescript`.
- **`minimumReleaseAge: 1440`**: a release younger than one day is refused; exceptions are listed under `minimumReleaseAgeExclude`.

## Tests

Each package has a `test/` folder run with Vitest:

- `@mipcheo/eslint`: the two custom rules with `RuleTester`, the shape of each configuration, and a lint of the package's own sources with the full configuration.
- `@mipcheo/prettier`: `defineConfig`, the options each configuration returns, and formatting real source with them.
- `@mipcheo/tsconfig`: each `tsconfig` read through the TypeScript API (following `extends`), with its key options checked.

```powershell
pnpm test
```
