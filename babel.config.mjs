import getBaseConfig from '@mui/internal-code-infra/babel-config';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import generateReleaseInfo from './scripts/generateReleaseInfo.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const errorCodesPath = path.resolve(dirname, './docs/public/static/error-codes.json');

/**
 * `babel-plugin-transform-react-remove-prop-types` only wraps the `propTypes` of components
 * it can detect (functions returning JSX). Components returning portals, arrays, or the
 * result of a render callback (e.g. the pickers' `renderPicker()`) are not detected, and
 * their `propTypes` would ship in production bundles.
 * This plugin wraps any remaining top-level `Component.propTypes = {...}` assignment in the
 * same `process.env.NODE_ENV !== "production"` guard, so bundlers can strip them.
 *
 * @type {babel.PluginObj | (babel: { types: typeof import('@babel/types') }) => babel.PluginObj}
 */
function wrapRemainingPropTypesPlugin({ types: t }) {
  return {
    name: 'wrap-remaining-prop-types',
    visitor: {
      ExpressionStatement(nodePath) {
        const expr = nodePath.node.expression;
        if (
          !t.isProgram(nodePath.parent) ||
          !t.isAssignmentExpression(expr, { operator: '=' }) ||
          !t.isMemberExpression(expr.left) ||
          !t.isIdentifier(expr.left.property, { name: 'propTypes' }) ||
          !t.isIdentifier(expr.left.object)
        ) {
          return;
        }
        nodePath.replaceWith(
          t.expressionStatement(
            t.conditionalExpression(
              t.binaryExpression(
                '!==',
                t.memberExpression(
                  t.memberExpression(t.identifier('process'), t.identifier('env')),
                  t.identifier('NODE_ENV'),
                ),
                t.stringLiteral('production'),
              ),
              expr,
              t.unaryExpression('void', t.numericLiteral(0)),
            ),
          ),
        );
      },
    },
  };
}

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
    baseConfig.plugins.push(wrapRemainingPropTypesPlugin);
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
