import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import replaceHeatmapHideLegendFalse from '../replace-heatmap-hide-legend-false';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    replaceHeatmapHideLegendFalse,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
