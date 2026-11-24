# @mipcheo/dev

Shared ESLint, Prettier and TypeScript configs. Built for MipCheo projects, and open to anyone who wants strict, standards-based defaults.

| Package | Configs |
| --- | --- |
| [`@mipcheo/eslint`](packages/eslint) | `base`, `jsdoc`, `prettier`, `stylistic`, `react`, `nextjs`, `storybook` |
| [`@mipcheo/prettier`](packages/prettier) | `base`, `jsdoc`, `markdown`, `tailwindcss` |
| [`@mipcheo/tsconfig`](packages/tsconfig) | `base`, `typescript`, `react`, `nextjs`, `nestjs` |

## Development

Use the Node.js version in [`.nvmrc`](.nvmrc), then:

```sh
pnpm install
```

| Command | What it does |
| --- | --- |
| `pnpm format` | Format with Prettier. |
| `pnpm check` | Check formatting, types and lint. |
| `pnpm test` | Run the tests. |
| `pnpm pack` | Pack every package into `out/`. |
| `pnpm publish` | Publish every package to registry. |

## Versions

All versions are in [`pnpm-workspace.yaml`](pnpm-workspace.yaml):

- `catalog`: exact versions, used as `"catalog:"`.
- `catalogs.peers`: the ranges a package asks the installing project for (`eslint`, `prettier`, `typescript`), used as `"catalog:peers"`.
- `overrides`: apply to this repository only; they are not published.

## License

[MIT](LICENSE)
