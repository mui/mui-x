import removeExperimentalFeatures from '../remove-stabilized-experimentalFeatures';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = removeExperimentalFeatures(file, api, options);

  return file.source;
}
