import removeProps from 'packages/x-codemod/src/util/removeProps';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const props = ['disableExtendRowFullWidth'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return removeProps({ root, j, props, componentNames }).toSource(printOptions);
}
