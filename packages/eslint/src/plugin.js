/** @import {Plugin} from '@eslint/core' */

import maxDefinitionParams from './rules/max-definition-params.js';
import modulePathStyle from './rules/module-path-style.js';

/** @type {Plugin} */
const projectPlugin = {
  meta: {
    name: 'eslint-plugin-project',
    version: '1.0.0',
    namespace: 'project',
  },

  rules: {
    'max-definition-params': maxDefinitionParams,
    'module-path-style': modulePathStyle,
  },
};

export default projectPlugin;
