import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';
import * as renameAxisTooltipHook from '../rename-axis-tooltip-hook';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    replaceHeatmapHideLegend,
    renameAxisTooltipHook,
  ].forEach((module) => {
    file.source = module.default(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules: [
    // Add other transforms here as they are created
    replaceHeatmapHideLegend,
  ],
};
