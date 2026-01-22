import transformRemoveDeprecatedSeriesTypes from '../remove-deprecated-series-types';
import transformRemoveIsBarSeriesHelpers from '../remove-is-bar-series-helpers';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRemoveDeprecatedSeriesTypes(file, api, options);
  file.source = transformRemoveIsBarSeriesHelpers(file, api, options);

  return file.source;
}
