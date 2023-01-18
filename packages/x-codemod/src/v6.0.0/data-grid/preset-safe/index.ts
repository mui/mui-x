import transformColumnMenu from '../column-menu-components-rename';
import removeDisableExtendRowFullWidth from '../remove-disableExtendRowFullWidth-prop';
import renameRowsPerPageOptions from '../rename-rowsPerPageOptions-prop';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformColumnMenu(file, api, options);
  file.source = removeDisableExtendRowFullWidth(file, api, options);
  file.source = renameRowsPerPageOptions(file, api, options);

  return file.source;
}
