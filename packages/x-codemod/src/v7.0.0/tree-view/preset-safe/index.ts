import transformRenameTreeViewSimpleTreeView from '../rename-tree-view-simple-tree-view';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameTreeViewSimpleTreeView(file, api, options);

  return file.source;
}
