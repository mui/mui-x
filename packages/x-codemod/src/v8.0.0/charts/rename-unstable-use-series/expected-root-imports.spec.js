"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-imports */
var x_charts_1 = require("@mui/x-charts");
var x_charts_pro_1 = require("@mui/x-charts-pro");
function useThings() {
    var series = (0, x_charts_1.useSeries)();
    var pieSeries = (0, x_charts_1.usePieSeries)();
    var lineSeries = (0, x_charts_1.useLineSeries)();
    var barSeries = (0, x_charts_1.useBarSeries)();
    var scatterSeries = (0, x_charts_1.useScatterSeries)();
    var heatmapSeries = (0, x_charts_pro_1.useHeatmapSeries)();
}
