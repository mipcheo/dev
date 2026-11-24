# @mipcheo/prettier

Shared Prettier configs.

## Installation

```sh
pnpm add -D @mipcheo/prettier prettier
```

## Usage

```js
// prettier.config.mjs
import { defineConfig } from '@mipcheo/prettier';
import { base } from '@mipcheo/prettier/base';
import { jsdoc } from '@mipcheo/prettier/jsdoc';
import { markdown } from '@mipcheo/prettier/markdown';

export default defineConfig(base(), jsdoc(), markdown());
```

`defineConfig` merges configs; the last one wins. To change an option, add it at the end: `defineConfig(base(), { printWidth: 120 })`.

## Configs

| Config | What it does |
| --- | --- |
| [`base()`](#base) | Options every project shares. |
| [`jsdoc()`](#jsdoc) | Formats JSDoc and wraps long arrays. |
| [`markdown()`](#markdown) | Compact tables, one line per paragraph. |
| [`tailwindcss(options)`](#tailwindcssoptions) | Sorts Tailwind CSS classes. |

### `base()`

| Option | Value | Effect |
| --- | --- | --- |
| `printWidth` | `160` | Wrap lines past 160 characters. |
| `tabWidth` | `2` | 2 spaces per indent. |
| `useTabs` | `false` | Spaces, not tabs. |
| `semi` | `true` | Semicolons. |
| `singleQuote` | `true` | `'single'` quotes. |
| `jsxSingleQuote` | `false` | `"double"` quotes in JSX. |
| `quoteProps` | `'consistent'` | Quote all keys of an object, or none. |
| `trailingComma` | `'es5'` | Trailing commas in arrays and objects. |
| `bracketSpacing` | `true` | `{ a }`, not `{a}`. |
| `bracketSameLine` | `false` | A tag's `>` on its own line. |
| `objectWrap` | `'preserve'` | Keep an object multi-line if written so. |
| `arrowParens` | `'always'` | `(x) => x`, not `x => x`. |
| `singleAttributePerLine` | `true` | One attribute per line when a tag wraps. |
| `proseWrap` | `'preserve'` | Leave prose as written. |
| `htmlWhitespaceSensitivity` | `'css'` | HTML whitespace follows CSS rules. |
| `embeddedLanguageFormatting` | `'auto'` | Format code inside other files. |
| `endOfLine` | `'lf'` | `\n` line endings. |
| `experimentalTernaries` | `true` | Nested ternaries read like `if`/`else`. |
| `experimentalOperatorPosition` | `'end'` | Operators at the end of a wrapped line. |

### `jsdoc()`

| Option | Value | Effect |
| --- | --- | --- |
| `tsdoc` | `true` | TSDoc style. |
| `jsdocDescriptionWithDot` | `true` | Descriptions end with a dot. |
| `jsdocSeparateReturnsFromParam` | `true` | Blank line before `@returns`. |
| `jsdocSeparateTagGroups` | `true` | Blank line between tag groups. |
| `jsdocPreferCodeFences` | `true` | Code examples in fences. |
| `multilineArraysWrapThreshold` | `3` | Arrays of more than 3 items, one item per line. |
| `multilineArraysLinePattern` | `''` | No fixed number of items per line. |

### `markdown()`

Compacts tables. In `.md` and `.mdx` files:

| Option | Value | Effect |
| --- | --- | --- |
| `printWidth` | `Infinity` | Lines never wrap. |
| `proseWrap` | `'never'` | One line per paragraph. |

### `tailwindcss(options)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `stylesheetPath` | `string` | required | Your main Tailwind CSS v4 stylesheet. |

It sets:

| Option | Value | Effect |
| --- | --- | --- |
| `tailwindStylesheet` | `stylesheetPath` | Read classes from this stylesheet. |
| `tailwindAttributes` | `['className', '/.+ClassName/']` | Sort classes in `className` and `*ClassName`. |
| `tailwindFunctions` | `['cn', 'cva', 'tw']` | Sort classes inside these functions. |
| `tailwindPreserveWhitespace` | `false` | Remove extra spaces. |
| `tailwindPreserveDuplicates` | `false` | Remove duplicate classes. |

## Development

```sh
pnpm test
pnpm check
```
