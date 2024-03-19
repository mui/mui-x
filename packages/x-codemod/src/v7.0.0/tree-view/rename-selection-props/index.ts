import renameProps from '../../../util/renameProps';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions;

  return renameProps({
    root,
    componentNames: ['TreeView', 'SimpleTreeView'],
    props: {
      selected: 'selectedItems',
      defaultSelected: 'defaultSelectedItems',
      onNodeSelect: 'onSelectedItemsChange',
    },
    j,
  }).toSource(printOptions);
}
