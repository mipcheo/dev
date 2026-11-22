/**
 * @import {Rule} from 'eslint'
 * @import {Node} from 'estree'
 */

const MAX_PARAMS = 3;

const functionTypes = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'TSDeclareFunction',
]);

/**
 * Limits parameters on function definitions while excluding callbacks passed directly or indirectly as arguments to calls or constructor calls.
 *
 * @type {Rule.RuleModule}
 */
const maxDefinitionParams = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Limit parameters in function definitions, excluding callbacks passed as arguments.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceed: 'Function definition has {{actual}} parameters. Maximum allowed is {{max}}. Consider using an options object.',
    },
  },

  create(context) {
    const max = context.options[0]?.max ?? MAX_PARAMS;

    /**
     * Determines whether this function is located inside an argument passed to a CallExpression or NewExpression.
     *
     * Walking stops at the nearest enclosing function. This prevents a function declared inside a callback body from being treated as a callback itself.
     *
     * @param {Node} node Rule Node.
     *
     * @returns {boolean} Is located inside an argument passed.
     */
    function isPassedAsArgument(node) {
      const ancestors = context.sourceCode.getAncestors(node);

      /** @type {Node} */
      let child = node;

      for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const parent = ancestors[index];

        if (!parent) {
          continue;
        }

        // Stop at the nearest enclosing function boundary.
        if (functionTypes.has(parent.type)) {
          return false;
        }

        // Ignore direct and nested functions used inside call arguments.
        if (
          (parent.type === 'CallExpression' || parent.type === 'NewExpression') &&
          'arguments' in parent &&
          Array.isArray(parent.arguments) &&
          parent.arguments.some((arg) => arg === child)
        ) {
          return true;
        }

        child = parent;
      }

      return false;
    }

    /**
     * Reports a function when its parameter count exceeds the configured max.
     *
     * @param {Node} node Rule Node.
     */
    function checkFunction(node) {
      if (isPassedAsArgument(node) || !('params' in node) || !Array.isArray(node.params)) {
        return;
      }

      const actual = node.params.length;

      if (actual <= max) {
        return;
      }

      context.report({
        node,
        messageId: 'exceed',
        data: {
          actual,
          max,
        },
      });
    }

    return {
      FunctionDeclaration(node) {
        checkFunction(node);
      },

      FunctionExpression(node) {
        checkFunction(node);
      },

      ArrowFunctionExpression(node) {
        checkFunction(node);
      },

      /** @param {Node} node Rule Node. */
      TSDeclareFunction(node) {
        checkFunction(node);
      },
    };
  },
};

export default maxDefinitionParams;
