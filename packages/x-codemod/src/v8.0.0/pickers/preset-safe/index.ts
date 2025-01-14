import transformAdapterDateFnsImports from '../rename-adapter-date-fns-imports';
import transformFieldValue from '../rename-and-move-field-value-type';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformAdapterDateFnsImports(file, api, options);
  file.source = transformFieldValue(file, api, options);

  return file.source;
}
