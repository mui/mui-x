import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';

const allModules = [
  // Add other transforms here as they are created
  replaceHeatmapHideLegend,
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
