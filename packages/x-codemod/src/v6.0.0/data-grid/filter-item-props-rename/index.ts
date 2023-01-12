import { ObjectProperty } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const VARIABLES = {
  columnField: 'field',
  operatorValue: 'operator',
};

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // - <DataGrid filterModel={{ items: [{ columnField: 'name', operatorValue: 'contains', value: 'a' }] }} />
  // + <DataGrid filterModel={{ items: [{ field: 'name', operator: 'contains', value: 'a' }] }} />
  root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes(path.value.openingElement.name.name);
    })
    .find(j.JSXAttribute)
    .filter((attribute) => {
      return attribute.node.name.name === 'filterModel';
    })
    .find(j.JSXExpressionContainer)
    .find(j.ObjectExpression)
    .find(j.ObjectProperty)
    .filter((property) => property.node.key.name === 'items')
    .find(j.ObjectProperty)
    .filter((property) => VARIABLES[property.node.key.name])
    .forEach((property) => {
      j(property).replaceWith(
        j.property(
          'init',
          j.identifier(VARIABLES[property.node.key.name as string]),
          j.literal(property.node.value.value),
        ),
      );
    })
    .toSource();

  return root.toSource(printOptions);
}
