import noDirectStateAccess from './rules/no-direct-state-access.mjs';

export default {
  meta: {
    name: '@mui/eslint-plugin-mui-x',
    version: '0.0.0',
  },
  rules: {
    'no-direct-state-access': noDirectStateAccess,
  },
};
