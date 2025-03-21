import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameProps from '../../../util/renameProps';

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const props = {
  unstable_rowSpanning: 'rowSpanning',
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return renameProps({ root, j, props, componentNames }).toSource(printOptions);
}
