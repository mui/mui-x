import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameProps from '../../../util/renameProps';

const props = {
  selectionModel: 'rowSelectionModel',
  onSelectionModelChange: 'onRowSelectionModelChange',
  disableSelectionOnClick: 'disableRowSelectionOnClick',
  disableMultipleSelection: 'disableMultipleRowSelection',
  showCellRightBorder: 'showCellVerticalBorder',
  showColumnRightBorder: 'showColumnVerticalBorder',
  headerHeight: 'columnHeaderHeight',
};

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return renameProps({
    root,
    componentNames,
    props,
    j,
  }).toSource(printOptions);
}
