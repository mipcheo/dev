import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';

import maxDefinitionParams from '../../src/rules/max-definition-params.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
  },
});

ruleTester.run('max-definition-params', maxDefinitionParams, {
  valid: [
    {
      name: 'a function declaration at the limit',
      code: 'function open(first, second, third) {}',
    },
    {
      name: 'an arrow function at the limit',
      code: 'const open = (first, second, third) => first;',
    },
    {
      name: 'a declared function at the limit',
      code: 'declare function open(first: string, second: string, third: string): void;',
    },
    {
      name: 'a callback passed to a call',
      code: 'items.reduce((total, item, index, all) => total, 0);',
    },
    {
      name: 'a callback passed to a constructor',
      code: 'new Watcher((file, kind, size, time) => file);',
    },
    {
      name: 'a callback inside an argument',
      code: 'register({ handler: (first, second, third, fourth) => first });',
    },
    {
      name: 'a higher limit given as an option',
      code: 'function open(first, second, third, fourth) {}',
      options: [{ max: 4 }],
    },
  ],

  invalid: [
    {
      name: 'a function declaration over the limit',
      code: 'function open(first, second, third, fourth) {}',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a function expression over the limit',
      code: 'const open = function (first, second, third, fourth) {};',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'an arrow function over the limit',
      code: 'const open = (first, second, third, fourth) => first;',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a method over the limit',
      code: 'class Door { open(first, second, third, fourth) {} }',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a declared function over the limit',
      code: 'declare function open(first: string, second: string, third: string, fourth: string): void;',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a function defined in the body of a callback',
      code: 'run(() => { function open(first, second, third, fourth) {} });',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a function called where it is defined, which is no argument',
      code: '(function (first, second, third, fourth) {})(1, 2, 3, 4);',
      errors: [{ messageId: 'exceed', data: { actual: 4, max: 3 } }],
    },
    {
      name: 'a lower limit given as an option',
      code: 'function open(first, second) {}',
      options: [{ max: 1 }],
      errors: [{ messageId: 'exceed', data: { actual: 2, max: 1 } }],
    },
  ],
});
