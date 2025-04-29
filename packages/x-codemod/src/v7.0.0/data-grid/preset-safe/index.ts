import transformRenameComponentsToSlots from '../rename-components-to-slots';
import renameCellSelectionProps from '../rename-cell-selection-props';
import removeExperimentalFeatures from '../remove-stabilized-experimentalFeatures';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameComponentsToSlots(file, api, options);
  file.source = renameCellSelectionProps(file, api, options);
  file.source = removeExperimentalFeatures(file, api, options);

  return file.source;
}
