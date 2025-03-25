// @ts-nocheck - TODO: fix this
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const attrName = 'rowSelectionModel';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options?: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Step 1: Collect variable names used in <DataGrid rowSelectionModel={...} />
  const usedInDataGrid = new Set();

  root
    .find(j.JSXOpeningElement)
    .filter(
      (path) =>
        j.JSXIdentifier.check(path.node.name) &&
        componentNames.some((name) => name === path.node.name.name),
    )
    .forEach((path) => {
      path.node.attributes?.forEach((attr) => {
        if (
          j.JSXAttribute.check(attr) &&
          j.JSXIdentifier.check(attr.name) &&
          attr.name.name === attrName &&
          attr.value &&
          j.JSXExpressionContainer.check(attr.value) &&
          j.Identifier.check(attr.value.expression)
        ) {
          usedInDataGrid.add(attr.value.expression.name);
        }
      });
    });

  if (usedInDataGrid.size === 0) {
    return file.source; // No relevant transformations needed
  }

  // Step 2: Convert only relevant `useState` or `useMemo` variables
  root
    .find(j.VariableDeclarator)
    .filter(
      (path) =>
        j.ArrayPattern.check(path.node.id) &&
        path.node.id.elements.length === 2 &&
        j.Identifier.check(path.node.id.elements[0]) &&
        usedInDataGrid.has(path.node.id.elements[0].name) && // Only modify if used in `componentNames`
        path.node.init &&
        j.CallExpression.check(path.node.init) &&
        ((j.MemberExpression.check(path.node.init.callee) &&
          j.Identifier.check(path.node.init.callee.object) &&
          ['React', 'useState', 'useMemo'].includes(path.node.init.callee.object.name)) ||
          ['useState', 'useMemo'].includes(path.node.init.callee.name)) && // Handle direct calls
        path.node.init.arguments.length > 0 &&
        (j.ArrayExpression.check(path.node.init.arguments[0]) ||
          (j.ArrowFunctionExpression.check(path.node.init.arguments[0]) &&
            j.BlockStatement.check(path.node.init.arguments[0].body) === false &&
            j.ArrayExpression.check(path.node.init.arguments[0].body))),
    )
    .forEach((path) => {
      const arrayExpression = j.ArrayExpression.check(path.node.init?.arguments[0])
        ? path.node.init?.arguments[0]
        : path.node.init?.arguments[0]?.body;

      const newObject = j.objectExpression([
        j.property('init', j.identifier('type'), j.literal('include')),
        j.property(
          'init',
          j.identifier('ids'),
          j.newExpression(j.identifier('Set'), [arrayExpression]),
        ),
      ]);

      if (j.ArrayExpression.check(path.node.init.arguments[0])) {
        path.node.init.arguments[0] = newObject;
      } else {
        path.node.init.arguments[0].body = newObject;
      }
    });

  const printOptions = options?.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return root.toSource(printOptions);
}
