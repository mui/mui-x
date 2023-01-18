import transformColumnMenu from '../column-menu-components-rename';
import renameRowSelectionProps from '../row-selection-props-rename';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformColumnMenu(file, api, options);
  file.source = renameRowSelectionProps(file, api, options);

  return file.source;
}
