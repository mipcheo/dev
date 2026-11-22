/**
 * @import {Rule} from 'eslint'
 * @import {Expression} from 'estree'
 * @import {Program} from 'typescript'
 */

import path from 'node:path';

const FOLDER_TAIL = '/*';

/**
 * @typedef {{
 *   name: string;
 *   directory: string;
 * }} Alias
 */

/**
 * Lists the aliases of the project a file belongs to, from the compiler options its parser read.
 *
 * @param {Rule.RuleContext} context Rule Context.
 *
 * @returns {Alias[]} Each `paths` entry that puts a name onto one folder, the deepest folder first.
 */
function readAliases(context) {
  /** @type {Program | null | undefined} */
  const program = context.sourceCode.parserServices?.program;
  const options = program?.getCompilerOptions();

  // TypeScript resolves `paths` against the folder of the config that declares them, which it keeps under `pathsBasePath`.
  const base = options?.['pathsBasePath'];
  if (typeof base !== 'string' || options?.paths === undefined) {
    return [];
  }

  /** @type {Alias[]} */
  const aliases = [];
  for (const [pattern, [target, ...fallbacks]] of Object.entries(options.paths)) {
    if (target === undefined || fallbacks.length > 0 || !pattern.endsWith(FOLDER_TAIL) || !target.endsWith(FOLDER_TAIL)) {
      continue;
    }

    aliases.push({
      name: pattern.slice(0, -FOLDER_TAIL.length),
      directory: path.resolve(base, target.slice(0, -FOLDER_TAIL.length)),
    });
  }

  return aliases.toSorted((first, second) => second.directory.length - first.directory.length);
}

/**
 * Tells whether a path from a folder stays in it, neither climbing out nor leaving the drive.
 *
 * @param {string} fromFolder A path as `path.relative` gives it.
 *
 * @returns {boolean} Stays in the folder.
 */
function isInside(fromFolder) {
  return fromFolder !== '..' && !fromFolder.startsWith(`..${path.sep}`) && !path.isAbsolute(fromFolder);
}

/**
 * Gives the relative path an aliased one should be: its target lies in the importing file's folder or beneath it.
 *
 * @param {string} specifier The module path as written.
 * @param {string} folder The importing file's folder.
 * @param {Alias[]} aliases The project's aliases.
 *
 * @returns {string | undefined} The relative path, or nothing when the path is no alias or its target lies elsewhere.
 */
function toRelative(specifier, folder, aliases) {
  const alias = aliases.find(({ name }) => specifier.startsWith(`${name}/`));
  if (alias === undefined) {
    return undefined;
  }

  const target = path.join(alias.directory, specifier.slice(alias.name.length + 1));
  const fromFolder = path.relative(folder, target);
  if (!isInside(fromFolder)) {
    return undefined;
  }

  return fromFolder === '' ? '.' : `./${fromFolder.replaceAll(path.sep, '/')}`;
}

/**
 * Gives the aliased path a climbing relative one should be.
 *
 * @param {string} specifier The module path as written.
 * @param {string} folder The importing file's folder.
 * @param {Alias[]} aliases The project's aliases.
 *
 * @returns {string | undefined} The aliased path, or nothing when the path does not climb or no alias covers its target.
 */
function toAlias(specifier, folder, aliases) {
  if (specifier !== '..' && !specifier.startsWith('../')) {
    return undefined;
  }

  const target = path.resolve(folder, specifier);
  for (const alias of aliases) {
    const fromAlias = path.relative(alias.directory, target);
    if (fromAlias !== '' && isInside(fromAlias)) {
      return `${alias.name}/${fromAlias.replaceAll(path.sep, '/')}`;
    }
  }

  return undefined;
}

/**
 * Holds a module path to the form its direction asks for, in every statement that names a module — `import`, `export … from`, `export * from` and `import()`: a
 * relative path for what lies in the file's own folder or beneath it, the project's alias where the path would climb out with `../`.
 *
 * The aliases are the `paths` of the file's own `tsconfig.json`, each entry that puts a name onto one folder. A project without one is left alone, and so is a
 * climb to a place no alias covers.
 *
 * @type {Rule.RuleModule}
 */
const modulePathStyle = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Write a module path by where it goes: relative beside the file or beneath it, the alias where it would climb out.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      relative: "'{{specifier}}' is beside this file or beneath it. Use '{{replacement}}'.",
      alias: "'{{specifier}}' climbs out of this file's folder. Use '{{replacement}}'.",
    },
  },

  create(context) {
    const aliases = readAliases(context);
    if (aliases.length === 0) {
      return {};
    }

    const folder = path.dirname(context.filename);

    /**
     * Reports a module path written against its direction, with the form it should have as the fix.
     *
     * @param {Expression | null | undefined} source The node that holds the module path.
     */
    function checkSource(source) {
      if (source?.type !== 'Literal' || typeof source.value !== 'string') {
        return;
      }

      const specifier = source.value;
      const relative = toRelative(specifier, folder, aliases);
      const replacement = relative ?? toAlias(specifier, folder, aliases);
      if (replacement === undefined) {
        return;
      }

      const [start, end] = context.sourceCode.getRange(source);

      context.report({
        node: source,
        messageId: relative === undefined ? 'alias' : 'relative',
        data: {
          specifier,
          replacement,
        },
        fix: (fixer) => fixer.replaceTextRange([start + 1, end - 1], replacement),
      });
    }

    return {
      ImportDeclaration(node) {
        checkSource(node.source);
      },

      ExportNamedDeclaration(node) {
        checkSource(node.source);
      },

      ExportAllDeclaration(node) {
        checkSource(node.source);
      },

      ImportExpression(node) {
        checkSource(node.source);
      },
    };
  },
};

export default modulePathStyle;
