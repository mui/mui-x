import transformColumnMenu from '../column-menu-components-rename';
import transformRowSelectionProps from '../row-selection-props-rename';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformColumnMenu(file, api, options);
  file.source = transformRowSelectionProps(file, api, options);

  return file.source;
}
