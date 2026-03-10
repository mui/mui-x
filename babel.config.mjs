import getBaseConfig from '@mui/internal-code-infra/babel-config';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import generateReleaseInfo from './scripts/generateReleaseInfo.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const errorCodesPath = path.resolve(dirname, './docs/public/static/error-codes.json');

/**
 * @typedef {import('@babel/core')} babel
 */

/** @type {babel.ConfigFunction} */
export default function getBabelConfig(api) {
  const baseConfig = getBaseConfig(api);

  baseConfig.plugins.push([
    '@mui/internal-babel-plugin-minify-errors',
    {
      detection: 'opt-out',
      errorCodesPath,
      outExtension: process.env.MUI_OUT_FILE_EXTENSION ?? undefined,
    },
  ]);

  const removePropTypesPlugin = baseConfig.plugins.find(
    (p) => p[2] === 'babel-plugin-transform-react-remove-prop-types',
  );
  if (removePropTypesPlugin) {
    removePropTypesPlugin[1] ??= {};
    removePropTypesPlugin[1].mode = 'unsafe-wrap';
    removePropTypesPlugin[1].ignoreFilenames ??= [];
    removePropTypesPlugin[1].ignoreFilenames.push('DataGrid.tsx', 'DataGridPro.tsx');
  }
  const displayNamePlugin = baseConfig.plugins.find(
    (p) => p[2] === '@mui/internal-babel-plugin-display-name',
  );

  if (displayNamePlugin) {
    displayNamePlugin[1] ??= {};
    displayNamePlugin[1].allowedCallees = {
      ...displayNamePlugin[1].allowedCallees,
      '@mui/x-internals/forwardRef': ['forwardRef'],
    };
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.TEST_BUILD) {
      baseConfig.plugins.push([
        'babel-plugin-react-remove-properties',
        { properties: ['data-testid'] },
      ]);
    }

    if (process.env.BABEL_ENV) {
      baseConfig.plugins.push([
        'babel-plugin-search-and-replace',
        {
          rules: [
            {
              search: '__RELEASE_INFO__',
              replace: generateReleaseInfo(),
            },
          ],
        },
      ]);

      baseConfig.plugins.push([
        'babel-plugin-transform-replace-expressions',
        {
          replace: [['__ALLOW_TEST_LICENSES__', 'false']],
        },
      ]);
    }
  }

  baseConfig.plugins.unshift(['@babel/plugin-transform-object-rest-spread', { loose: true }]);
  delete baseConfig.assumptions.setSpreadProperties;

  return baseConfig;
}
