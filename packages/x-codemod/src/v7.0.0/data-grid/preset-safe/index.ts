import transformRenameComponentsToSlots from '../rename-components-to-slots';
import renameCellSelectionProps from '../rename-cell-selection-props';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameComponentsToSlots(file, api, options);
  file.source = renameCellSelectionProps(file, api, options);

  return file.source;
}
