"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hooks_1 = require("@mui/x-charts/hooks");
var hooks_2 = require("@mui/x-charts-pro/hooks");
function useThings() {
    var series = (0, hooks_1.useSeries)();
    var pieSeries = (0, hooks_1.usePieSeries)();
    var lineSeries = (0, hooks_1.useLineSeries)();
    var barSeries = (0, hooks_1.useBarSeries)();
    var scatterSeries = (0, hooks_1.useScatterSeries)();
    var heatmapSeries = (0, hooks_2.useHeatmapSeries)();
}
