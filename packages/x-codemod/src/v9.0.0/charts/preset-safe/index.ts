import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as renameIdToSeriesId from '../rename-id-to-series-id';
import * as renameChartApiImport from '../rename-chart-api-import';
import * as renameChartContainer from '../rename-chart-container';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';
import * as replaceShowMarkDefault from '../replace-show-mark-default';
import * as renameLegendToSlots from '../rename-legend-to-slots-legend';
import * as renameResponsiveContainer from '../rename-responsive-chart-container';
import * as renameLabelAndTickFontSize from '../rename-label-and-tick-font-size';
import * as replaceLegendDirectionValues from '../replace-legend-direction-values';
import * as replaceLegendPositionValues from '../replace-legend-position-values';
import * as removeExperimentalMarkRendering from '../remove-experimental-mark-rendering';
import * as renameLegendPositionType from '../rename-legend-position-type';
import * as replaceAxisClickHandler from '../remove-on-axis-click-handler';
import * as renameUnstableUseSeries from '../rename-unstable-use-series';
import * as replaceLegendHiddenSlotProp from '../replace-legend-hidden-slot-prop';
import * as removeDeprecatedSeriesTypes from '../remove-deprecated-series-types/index';
import * as removeIsBarSeriesHelpers from '../remove-is-bar-series-helpers/index';

const allModules = [
  // Add other transforms here as they are created
  replaceHeatmapHideLegend,
  replaceShowMarkDefault,
  renameIdToSeriesId,
  renameChartApiImport,
  renameChartContainer,
  renameLegendToSlots,
  renameResponsiveContainer,
  renameLabelAndTickFontSize,
  replaceLegendDirectionValues,
  replaceLegendPositionValues,
  removeExperimentalMarkRendering,
  renameLegendPositionType,
  replaceAxisClickHandler,
  renameUnstableUseSeries,
  replaceLegendHiddenSlotProp,
  removeDeprecatedSeriesTypes,
  removeIsBarSeriesHelpers,
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
