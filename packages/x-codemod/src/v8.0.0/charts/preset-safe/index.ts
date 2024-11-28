import transformLegendToSlots from '../rename-legend-to-slots-legend';
import transformRemoveResponsiveContainer from '../rename-responsive-chart-container';
import transformRenameLabelAndTickFontSize from '../rename-label-and-tick-font-size';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformLegendToSlots(file, api, options);
  file.source = transformRemoveResponsiveContainer(file, api, options);
  file.source = transformRenameLabelAndTickFontSize(file, api, options);

  return file.source;
}
