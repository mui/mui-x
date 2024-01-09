import transformRenameExpansionProps from '../rename-expansion-props';
import transformRenameSelectionProps from '../rename-selection-props';
import transformRenameTreeViewSimpleTreeView from '../rename-tree-view-simple-tree-view';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameExpansionProps(file, api, options);
  file.source = transformRenameSelectionProps(file, api, options);
  file.source = transformRenameTreeViewSimpleTreeView(file, api, options);

  return file.source;
}
