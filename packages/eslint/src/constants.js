import path from 'node:path';

/** The glob pattern for JavaScript files. */
export const JS_FILE_PATTERN = '**/*.{js,mjs,jsx}';

/** The glob pattern for TypeScript files. */
export const TS_FILE_PATTERN = '**/*.{ts,mts,tsx}';

/** The glob pattern for Markdown and MDX files. */
export const MDX_FILE_PATTERN = '**/*.{md,mdx}';

/** The glob pattern for Next.js server action files in JavaScript. */
export const ACTION_JS_FILE_PATTERN = '**/*.action.{js,mjs,jsx}';

/** The glob pattern for Next.js server action files in TypeScript. */
export const ACTION_TS_FILE_PATTERN = '**/*.action.{ts,mts,tsx}';

/** The glob pattern for Storybook's own JavaScript files. */
export const STORYBOOK_JS_FILE_PATTERN = `.storybook/${JS_FILE_PATTERN}`;

/** The glob pattern for Storybook's own TypeScript files. */
export const STORYBOOK_TS_FILE_PATTERN = `.storybook/${TS_FILE_PATTERN}`;

/** The root directory of the workspace. */
export const WORKSPACE_ROOT_DIR = path.resolve(import.meta.dirname, '../../../../');
