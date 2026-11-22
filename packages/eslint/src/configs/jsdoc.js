/** @import {Linter} from 'eslint' */

import * as jsdocPlugin from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';

import { JS_FILE_PATTERN, TS_FILE_PATTERN } from '../constants.js';

const { rules } = jsdocPlugin.jsdoc({
  rules: {
    'jsdoc/require-jsdoc': [
      'warn',
      {
        publicOnly: {
          ancestorsOnly: true,
          cjs: true,
          esm: true,
          window: false,
        },
        exemptEmptyConstructors: true,
        require: {
          ClassDeclaration: true,
          ClassExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
        contexts: [
          'TSTypeAliasDeclaration',
          'TSInterfaceDeclaration',
          'TSMethodSignature',
          'TSPropertySignature',
          'ExportNamedDeclaration > VariableDeclaration',
        ],
      },
    ],
    'jsdoc/require-param': [
      'warn',
      {
        checkDestructured: false,
        contexts: ['FunctionDeclaration', 'FunctionExpression'],
      },
    ],
    'jsdoc/require-returns': [
      'warn',
      {
        checkGetters: false,
        contexts: ['FunctionDeclaration', 'FunctionExpression'],
      },
    ],
    'jsdoc/require-template': [
      'warn',
      {
        requireSeparateTemplates: true,
      },
    ],
    'jsdoc/check-param-names': [
      'warn',
      {
        checkDestructured: false,
      },
    ],
    'jsdoc/tag-lines': [
      'warn',
      'always',
      {
        count: 0,
        startLines: 1,
      },
    ],
  },
});

/**
 * JSDoc ESLint configuration.
 *
 * @returns {Linter.Config[]} JSDoc ESLint configuration.
 */
export function jsdoc() {
  return defineConfig(
    jsdocPlugin.jsdoc({
      config: 'flat/recommended',
      files: [JS_FILE_PATTERN],
      rules: {
        ...rules,
      },
    }),
    jsdocPlugin.jsdoc({
      config: 'flat/recommended-typescript',
      files: [TS_FILE_PATTERN],
      rules: {
        ...rules,
      },
    })
  );
}
