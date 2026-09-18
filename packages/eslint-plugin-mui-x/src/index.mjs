import noComputedKeyWithRest from './rules/no-computed-key-with-rest.mjs';
import noDirectStateAccess from './rules/no-direct-state-access.mjs';

export default /** @type {import('eslint').ESLint.Plugin} */ {
  meta: {
    name: '@mui/eslint-plugin-mui-x',
    version: '0.0.0',
  },
  rules: {
    'no-computed-key-with-rest': noComputedKeyWithRest,
    'no-direct-state-access': noDirectStateAccess,
  },
};
