import transformRenameExpansionProps from '../rename-expansion-props';
import transformRenameSelectionProps from '../rename-selection-props';
import transformOnNodeFocus from '../rename-focus-callback';
import transformRenameNodeId from '../rename-nodeid';
import transformReplaceTransitionPropsBySlot from '../replace-transition-props-by-slot';
import transformRenameUseTreeItem from '../rename-use-tree-item';
import transformRenameTreeViewSimpleTreeView from '../rename-tree-view-simple-tree-view';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameExpansionProps(file, api, options);
  file.source = transformRenameSelectionProps(file, api, options);
  file.source = transformOnNodeFocus(file, api, options);
  file.source = transformRenameNodeId(file, api, options);
  file.source = transformReplaceTransitionPropsBySlot(file, api, options);
  file.source = transformRenameUseTreeItem(file, api, options);
  file.source = transformRenameTreeViewSimpleTreeView(file, api, options);

  return file.source;
}
