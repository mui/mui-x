import transformLegendToSlots from '../rename-legend-to-slots-legend';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformLegendToSlots(file, api, options);

  return file.source;
}
