import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as renameChartApiImport from '../rename-chart-api-import';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';

const allModules = [
  // Add other transforms here as they are created
  replaceHeatmapHideLegend,
  renameChartApiImport,
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  allModules.forEach((module) => {
    file.source = module.default(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules,
};
