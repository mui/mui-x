import transformFieldValue from '../rename-and-move-field-value-type';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformFieldValue(file, api, options);

  return file.source;
}
