import transformRenameComponentsToSlots from '../../../v6.0.0/pickers/rename-components-to-slots';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameComponentsToSlots(file, api, options);

  return file.source;
}
