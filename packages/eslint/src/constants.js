/** The glob pattern for JavaScript files. */
export const JS_FILE_PATTERN = '**/*.{js,mjs,jsx}';

/** The glob pattern for TypeScript files. */
export const TS_FILE_PATTERN = '**/*.{ts,mts,tsx}';

/** The glob pattern for Markdown and MDX files. */
export const MDX_FILE_PATTERN = '**/*.{md,mdx}';

/** The glob pattern for the code blocks of Markdown and MDX files, which the MDX processor hands to ESLint as files inside the Markdown file's path. */
export const MDX_CODE_BLOCK_FILE_PATTERN = `${MDX_FILE_PATTERN}/**`;

/** The glob pattern for Next.js server action files in JavaScript. */
export const ACTION_JS_FILE_PATTERN = '**/*.action.{js,mjs,jsx}';

/** The glob pattern for Next.js server action files in TypeScript. */
export const ACTION_TS_FILE_PATTERN = '**/*.action.{ts,mts,tsx}';

/** The glob pattern for Storybook's own JavaScript files. */
export const STORYBOOK_JS_FILE_PATTERN = `.storybook/${JS_FILE_PATTERN}`;

/** The glob pattern for Storybook's own TypeScript files. */
export const STORYBOOK_TS_FILE_PATTERN = `.storybook/${TS_FILE_PATTERN}`;
