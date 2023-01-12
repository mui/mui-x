import { Collection, JSCodeshift } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const VARIABLES = {
  columnField: 'field',
  operatorValue: 'operator',
};

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];

const replaceFilterItem = (filterModel: Collection<any>, j: JSCodeshift) => {
  filterModel
    .find(j.ObjectProperty)
    .filter((property) => (property.node as any).key.name === 'items')
    .find(j.ObjectProperty)
    .filter((property) => VARIABLES[(property.node as any).key.name])
    .forEach((property) => {
      j(property).replaceWith(
        j.property(
          'init',
          j.identifier(VARIABLES[(property.node as any).key.name as string]),
          j.literal((property.node as any).value.value),
        ),
      );
    });
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const gridNodes = root.find(j.JSXElement).filter((path) => {
    return componentNames.includes((path.value.openingElement.name as any).name);
  });

  // <DataGrid(Pro|Premium) 
  //   filterModel={{ 
  //     items: [{ 
  // -     columnField: 'name',
  // +     field: 'name',
  // -     operatorValue: 'contains', 
  // +     operator: 'contains', 
  //       value: 'a' 
  //     }] 
  //   }}
  // />
  replaceFilterItem(
    gridNodes.find(j.JSXAttribute).filter((path) => {
      return path.node.name.name === 'filterModel';
    }),
    j,
  );

  // <DataGrid(Pro|Premium)
  //   initialState={{
  //     filter: {
  //       filterModel: {
  //         items: [{
  // -         columnField: 'name',
  // +         field: 'name',
  // -         operatorValue: 'contains',
  // +         operator: 'contains',
  //           value: 'a'
  //         }]
  //       }
  //     }
  //   }}
  // />
  replaceFilterItem(
    gridNodes
      .find(j.JSXAttribute)
      .filter((path) => {
        return path.node.name.name === 'initialState';
      })
      .find(j.ObjectProperty)
      .filter((path) => (path.node.key as any).name === 'filter')
      .find(j.ObjectProperty)
      .filter((path) => (path.node.key as any).name === 'filterModel'),
    j,
  );

  return root.toSource(printOptions);
}
