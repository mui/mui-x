"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANDLESTICK_CHART_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var plugins_1 = require("@mui/x-charts-pro/plugins");
exports.CANDLESTICK_CHART_PLUGINS = [
    internals_1.useChartTooltip,
    internals_1.useChartInteraction,
    internals_1.useChartCartesianAxis,
    internals_1.useChartHighlight,
    plugins_1.useChartProZoom,
    internals_1.useChartVisibilityManager,
    plugins_1.useChartProExport,
];
