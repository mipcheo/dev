# @mipcheo/prettier

Shared Prettier configurations, split into blocks and merged with `defineConfig`.

## Installation

```powershell
pnpm add -D @mipcheo/prettier
```

The package brings `prettier` and the plugins it needs.

## Usage

```js
// prettier.config.mjs
import { defineConfig } from '@mipcheo/prettier';
import { base } from '@mipcheo/prettier/base';
import { jsdoc } from '@mipcheo/prettier/jsdoc';
import { markdown } from '@mipcheo/prettier/markdown';
import { tailwindcss } from '@mipcheo/prettier/tailwindcss';

const config = defineConfig(base(), jsdoc(), markdown(), tailwindcss({ stylesheetPath: './src/app.css' }));

export default config;
```

Each block is a function that returns a new configuration on every call. To change an option, pass an object of your own after the blocks: `defineConfig(base(), { printWidth: 120 })`.

## `defineConfig(...configs)`

Merges several configurations into one: the `plugins` of every configuration are joined in order, and for every other option a later configuration wins. The configurations passed in are left unchanged.

## Configurations

| Import | Function | For |
| --- | --- | --- |
| `@mipcheo/prettier/base` | [`base()`](#base) | Every project. |
| `@mipcheo/prettier/jsdoc` | [`jsdoc()`](#jsdoc) | Projects with JSDoc or TSDoc comments. |
| `@mipcheo/prettier/markdown` | [`markdown()`](#markdown) | Projects with Markdown files. |
| `@mipcheo/prettier/tailwindcss` | [`tailwindcss(options)`](#tailwindcssoptions) | Projects using Tailwind CSS v4. |

### `base()`

The options every project shares.

| Option | Value | Effect |
| --- | --- | --- |
| `printWidth` | `160` | Lines wrap past 160 characters. |
| `tabWidth` | `2` | Two spaces per indent level. |
| `useTabs` | `false` | Indent with spaces. |
| `semi` | `true` | Semicolons at the end of statements. |
| `singleQuote` | `true` | Single quotes in JS and TS. |
| `jsxSingleQuote` | `false` | Double quotes in JSX attributes. |
| `quoteProps` | `'consistent'` | If one object key needs quotes, all keys of that object get them. |
| `trailingComma` | `'es5'` | Trailing commas where ES5 allows them (arrays, objects). |
| `bracketSpacing` | `true` | `{ a }` rather than `{a}`. |
| `bracketSameLine` | `false` | The `>` of a multi-line JSX tag goes on its own line. |
| `objectWrap` | `'preserve'` | An object stays multi-line if its first key is on a new line. |
| `arrowParens` | `'always'` | `(x) => x` rather than `x => x`. |
| `singleAttributePerLine` | `true` | One JSX or HTML attribute per line once a tag wraps. |
| `proseWrap` | `'preserve'` | Prose is left as written (Markdown files are set by `markdown()`). |
| `htmlWhitespaceSensitivity` | `'css'` | Whitespace in HTML follows the CSS `display` of each element. |
| `embeddedLanguageFormatting` | `'auto'` | Code embedded in other files (CSS in JS, code blocks in Markdown) is formatted. |
| `endOfLine` | `'lf'` | `\n` line endings on every platform. |
| `experimentalTernaries` | `true` | Nested ternaries are laid out as a chain of cases. |
| `experimentalOperatorPosition` | `'end'` | A wrapped binary expression keeps its operator at the end of the line. |

`experimentalTernaries` and `experimentalOperatorPosition` will become `ternaries` and `operatorPosition` once Prettier knows those names.

### `jsdoc()`

Formats JSDoc comments and wraps long arrays, with `prettier-plugin-jsdoc` and `prettier-plugin-multiline-arrays`.

| Option | Value | Effect |
| --- | --- | --- |
| `tsdoc` | `true` | TSDoc-style comments. |
| `jsdocDescriptionWithDot` | `true` | A description ends with a dot. |
| `jsdocSeparateReturnsFromParam` | `true` | A blank line between `@param` and `@returns`. |
| `jsdocSeparateTagGroups` | `true` | A blank line between groups of different tags. |
| `jsdocPreferCodeFences` | `true` | Code examples in fences rather than indented. |
| `multilineArraysWrapThreshold` | `3` | An array with more than 3 items puts one item on each line. |
| `multilineArraysLinePattern` | `''` | No fixed number of items per line. |

`prettier-plugin-jsdoc` and `prettier-plugin-multiline-arrays` both replace Prettier's parsers; listed separately, the later one would override the earlier. `jsdoc()` builds a single plugin that runs both `preprocess` steps in turn.

### `markdown()`

Compacts Markdown tables with `prettier-plugin-markdown-compact-tables`, and keeps each paragraph of a Markdown file on one line, so a frontmatter `tags` line is never wrapped. These options apply to `**/*.{md,mdx}` only.

| Option | Value | Effect |
| --- | --- | --- |
| `printWidth` | `Infinity` | Lines never wrap. |
| `proseWrap` | `'never'` | Each paragraph is joined onto one line. |

### `tailwindcss(options)`

Sorts Tailwind CSS classes with `prettier-plugin-tailwindcss`. It takes one argument:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `stylesheetPath` | `string` | (required) | The path of the main Tailwind CSS v4 stylesheet. |

and sets:

| Option | Value | Effect |
| --- | --- | --- |
| `tailwindStylesheet` | `stylesheetPath` | Classes are read from this stylesheet. |
| `tailwindAttributes` | `['className', '/.+ClassName/']` | Classes are sorted in `className` and in any attribute ending with `ClassName`. |
| `tailwindFunctions` | `['cn', 'cva', 'tw']` | Classes are sorted in the arguments of these functions. |
| `tailwindPreserveWhitespace` | `false` | Extra whitespace between classes is removed. |
| `tailwindPreserveDuplicates` | `false` | Duplicate classes are removed. |

## Development

```powershell
pnpm test    # Vitest
pnpm check   # tsc --noEmit, then eslint
```

The tests in `test/` cover `defineConfig`, the options each configuration returns, and formatting real source with them.
