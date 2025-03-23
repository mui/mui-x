import transformAdapterDateFnsImports from '../rename-adapter-date-fns-imports';
import transformTypeImports from '../rename-type-imports';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformAdapterDateFnsImports(file, api, options);
  file.source = transformTypeImports(file, api, options);

  return file.source;
}
