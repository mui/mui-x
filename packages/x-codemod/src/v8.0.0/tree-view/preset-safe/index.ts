import transformRenameTreeItem2 from '../rename-tree-item-2';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameTreeItem2(file, api, options);

  return file.source;
}
