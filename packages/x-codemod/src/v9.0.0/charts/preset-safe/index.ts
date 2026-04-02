import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as renameIdToSeriesId from '../rename-id-to-series-id';
import * as renameChartApiImport from '../rename-chart-api-import';
import * as renameChartContainer from '../rename-chart-container';
import * as renameChartDataProvider from '../rename-chart-data-provider';
import * as renameChartZoomSlider from '../rename-chart-zoom-slider';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';
import * as renameSankeyChart from '../rename-sankey-chart';
import * as replaceShowMarkDefault from '../replace-show-mark-default';
import * as removeEnableKeyboardNavigation from '../remove-enable-keyboard-navigation';
import * as removeStabilizedExperimentalFeatures from '../remove-stabilized-experimentalFeatures';
import * as renameVoronoiMaxRadius from '../rename-voronoi-max-radius';
import * as removeDeprecatedSeriesTypes from '../remove-deprecated-series-types';
import * as removeIsBarSeriesHelpers from '../remove-is-bar-series-helpers';

const allModules = [
  // Add other transforms here as they are created
  replaceHeatmapHideLegend,
  replaceShowMarkDefault,
  removeEnableKeyboardNavigation,
  removeStabilizedExperimentalFeatures,
  renameIdToSeriesId,
  renameChartApiImport,
  renameSankeyChart,
  renameChartContainer,
  renameChartDataProvider,
  renameChartZoomSlider,
  renameVoronoiMaxRadius,
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
