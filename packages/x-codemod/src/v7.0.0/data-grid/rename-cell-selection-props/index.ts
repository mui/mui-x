import renameProps from '../../../util/renameProps';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const componentNames = ['DataGridPremium'];
const props = {
  unstable_cellSelection: 'cellSelection',
  unstable_cellSelectionModel: 'cellSelectionModel',
  unstable_onCellSelectionModelChange: 'onCellSelectionModelChange',
  unstable_ignoreValueFormatterDuringExport: 'ignoreValueFormatterDuringExport',
  unstable_splitClipboardPastedText: 'splitClipboardPastedText',
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
