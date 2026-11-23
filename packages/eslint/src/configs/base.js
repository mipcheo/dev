/** @import {Linter} from 'eslint' */

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import { configs as sonarPlugin } from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { JS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';
import projectPlugin from '../plugin.js';

/**
 * @typedef {{
 *       regex: string;
 *       message: string;
 *     }
 *   | {
 *       group: string[];
 *       message: string;
 *     }} RestrictedImport
 *
 * @typedef {{
 *   globals?: (keyof typeof globals)[];
 *   rootDir: string;
 *   projectDir?: string;
 *   sourceType: 'module' | 'commonjs';
 *   ignores?: string[];
 *   restrictedImports?: RestrictedImport[];
 * }} Options
 */

/**
 * Base ESLint configuration: the ignores every project shares, and what every TypeScript and JavaScript file is held to.
 *
 * @param {Options} options The options for the Base ESLint configuration.
 *
 * @returns {Linter.Config[]} Base ESLint configuration.
 */
export function base({ globals: globalNames = [], rootDir, projectDir = rootDir, sourceType, ignores = [], restrictedImports = [] }) {
  /** @type {Record<string, boolean>} */
  const languageGlobals = {};
  for (const globalName of globalNames) {
    const globalSet = globals[globalName];
    for (const [name, value] of Object.entries(globalSet)) {
      if (languageGlobals[name] === true) {
        continue;
      }

      languageGlobals[name] = value;
    }
  }

  return defineConfig(
    globalIgnores([
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      ...ignores,
    ]),
    {
      files: [TS_FILE_PATTERN, JS_FILE_PATTERN],
      extends: [
        eslint.configs.recommended,
        tseslint.configs.recommendedTypeChecked,

        unicornPlugin.configs.recommended,

        importPlugin.flatConfigs.recommended,
        importPlugin.flatConfigs.typescript,

        sonarPlugin.recommended,
      ],
      plugins: {
        'project': projectPlugin,
        'unused-imports': unusedImportsPlugin,
      },
      languageOptions: {
        sourceType,
        parserOptions: {
          projectService: {
            allowDefaultProject: ['*.config.mjs'],
          },
          tsconfigRootDir: projectDir,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        },
        globals: languageGlobals,
      },
      settings: {
        'import-x/resolver': {
          typescript: {
            project: projectDir,
            alwaysTryTypes: true,
            noWarnOnMultipleProjects: true,
          },
          node: {
            extensions: [
              '.js',
              '.jsx',
              '.cjs',
              '.mjs',
              '.ts',
              '.tsx',
              '.cts',
              '.mts',
            ],
          },
        },
        'import-x/parsers': {
          '@typescript-eslint/parser': [
            '.ts',
            '.tsx',
            '.cts',
            '.mts',
          ],
        },
      },
      rules: {
        // Standard
        'max-params': 'off',
        'project/max-definition-params': 'error',
        'no-prototype-builtins': 'error',
        'prefer-object-has-own': 'error',
        'no-promise-executor-return': 'error',
        'complexity': [
          'error',
          {
            variant: 'modified',
          },
        ],
        'max-depth': 'error',
        'max-nested-callbacks': 'error',
        'prefer-rest-params': 'error',
        'prefer-destructuring': 'error',
        ...(restrictedImports.length > 0 && {
          'no-restricted-imports': [
            'error',
            {
              patterns: restrictedImports,
            },
          ],
        }),

        // TypeScript
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/return-await': ['error', 'always'],
        '@typescript-eslint/promise-function-async': [
          'error',
          {
            allowAny: true,
          },
        ],
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/no-unnecessary-condition': [
          'error',
          {
            allowConstantLoopConditions: 'only-allowed-literals',
          },
        ],
        '@typescript-eslint/no-empty-object-type': [
          'error',
          {
            allowInterfaces: 'always',
          },
        ],
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: true,
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/naming-convention': [
          'error',

          // Class, Interface, Type
          {
            selector: ['typeLike'],
            format: ['PascalCase'],
          },
          {
            selector: ['typeParameter'],
            format: ['PascalCase'],
            custom: {
              regex: '^T[A-Z]',
              match: true,
            },
          },
          {
            selector: ['interface'],
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: true,
            },
          },
          {
            selector: [
              'accessor',
              'memberLike',
              'method',
              'property',
            ],
            format: ['camelCase'],
            leadingUnderscore: 'require',
            modifiers: ['private'],
          },

          // Object
          {
            selector: ['objectLiteralProperty'],
            format: null,
          },

          // Function
          {
            selector: ['function'],
            format: ['camelCase', 'PascalCase'],
            types: ['function'],
          },
          {
            selector: ['variable'],
            format: ['camelCase', 'PascalCase'],
            modifiers: ['const'],
            types: ['function'],
          },

          // Constants
          {
            selector: ['classProperty'],
            format: ['UPPER_CASE'],
            modifiers: ['public', 'static', 'readonly'],
          },
          {
            selector: ['classProperty'],
            format: ['UPPER_CASE'],
            modifiers: ['protected', 'static', 'readonly'],
          },
          {
            selector: ['classProperty'],
            format: ['UPPER_CASE'],
            leadingUnderscore: 'require',
            modifiers: ['private', 'static', 'readonly'],
          },
          {
            selector: ['classProperty'],
            format: ['UPPER_CASE'],
            modifiers: ['#private', 'static', 'readonly'],
          },
          {
            selector: ['typeProperty'],
            format: ['UPPER_CASE'],
            modifiers: ['readonly'],
          },
          {
            selector: ['variable'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            modifiers: ['const'],
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
          },

          // Default
          {
            selector: ['default'],
            format: null,
            modifiers: ['global'],
            leadingUnderscore: 'requireDouble',
            trailingUnderscore: 'requireDouble',
          },
          {
            selector: ['default'],
            format: null,
            modifiers: ['unused'],
            leadingUnderscore: 'require',
          },
          {
            selector: ['default'],
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
          },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksConditionals: true,
            checksSpreads: true,
            checksVoidReturn: {
              arguments: true,
              attributes: false,
              inheritedMethods: true,
              properties: true,
              returns: true,
              variables: true,
            },
          },
        ],

        // Unicorn
        'unicorn/no-null': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/filename-case': [
          'error',
          {
            case: 'kebabCase',
            multipleFileExtensions: false,
          },
        ],
        'unicorn/name-replacements': [
          'error',
          {
            checkFilenames: true,
            checkVariables: true,
            checkDefaultAndNamespaceImports: true,
            replacements: {
              arg: false,
              args: false,
              dev: false,
              dir: false,
              doc: false,
              docs: false,
              env: false,
              obj: false,
              param: false,
              params: false,
              prev: false,
              prop: false,
              props: false,
              ref: false,
              refs: false,
              repo: false,
              util: false,
              utils: false,
            },
          },
        ],
        'unicorn/consistent-boolean-name': [
          'error',
          {
            prefixes: {
              are: false,
              have: false,
              can: false,
              was: false,
              were: false,
              does: false,
              did: false,
              will: false,
              requires: false,
            },
          },
        ],
        'unicorn/consistent-class-member-order': [
          'error',
          {
            order: [
              'static-field',
              'static-block',
              'static-method',
              'private-field',
              'public-field',
              'constructor',
              'public-method',
              'private-method',
            ],
          },
        ],
        'unicorn/prefer-global-this': 'error',
        'unicorn/class-reference-in-static-methods': [
          'error',
          {
            preferThis: false,
            preferSuper: false,
          },
        ],

        // Import/Export
        'import-x/no-named-as-default-member': 'off',
        'project/module-path-style': 'error',
        'import-x/no-anonymous-default-export': 'error',
        'import-x/no-extraneous-dependencies': [
          'error',
          {
            packageDir: [rootDir, projectDir],
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: false,
            bundledDependencies: false,
          },
        ],
        'import-x/no-unresolved': [
          'error',
          {
            ignore: ['^(/|#)', String.raw`\.(scss|less|css)$`],
          },
        ],
        'import-x/no-cycle': [
          'error',
          {
            maxDepth: Infinity,
          },
        ],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],

        // Sonar
        'sonarjs/unused-import': 'off',
        'sonarjs/prefer-immediate-return': 'error',
        'sonarjs/cognitive-complexity': ['error', 15],
      },
    },
    {
      files: [JS_FILE_PATTERN],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    }
  );
}
