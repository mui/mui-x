import removeProps from '../../../util/removeProps';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { transformNestedProp } from '../../../util/addComponentsSlots';

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const propsToRename = {
  onCellFocusOut: { prop: 'componentsProps', path: 'cell.onBlur' },
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .forEach((path) => {
      const attributesToTransform = j(path)
        .find(j.JSXAttribute)
        .filter((attribute) =>
          Object.keys(propsToRename).includes(attribute.value.name.name as string),
        );
      attributesToTransform.forEach((attribute) => {
        const attributeName = attribute.value.name.name as string;

        const value =
          attribute.value.value?.type === 'JSXExpressionContainer'
            ? attribute.value.value.expression
            : attribute.value.value;

        transformNestedProp(
          path,
          propsToRename[attributeName].prop,
          propsToRename[attributeName].path,
          value,
          j,
        );
      });
    });

  return removeProps({ root, j, props: Object.keys(propsToRename), componentNames }).toSource(
    printOptions,
  );
}
