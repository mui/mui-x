"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSeriesConfig = void 0;
exports.ChartProvider = ChartProvider;
var React = require("react");
var useCharts_1 = require("../../internals/store/useCharts");
var ChartContext_1 = require("./ChartContext");
var useChartCartesianAxis_1 = require("../../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartInteraction_1 = require("../../internals/plugins/featurePlugins/useChartInteraction");
var useChartZAxis_1 = require("../../internals/plugins/featurePlugins/useChartZAxis");
var useChartHighlight_1 = require("../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight");
var seriesConfig_1 = require("../../BarChart/seriesConfig");
var seriesConfig_2 = require("../../ScatterChart/seriesConfig");
var seriesConfig_3 = require("../../LineChart/seriesConfig");
var seriesConfig_4 = require("../../PieChart/seriesConfig");
exports.defaultSeriesConfig = {
    bar: seriesConfig_1.seriesConfig,
    scatter: seriesConfig_2.seriesConfig,
    line: seriesConfig_3.seriesConfig,
    pie: seriesConfig_4.seriesConfig,
};
// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
var defaultPlugins = [
    useChartZAxis_1.useChartZAxis,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
];
function ChartProvider(props) {
    var children = props.children, _a = props.plugins, plugins = _a === void 0 ? defaultPlugins : _a, _b = props.pluginParams, pluginParams = _b === void 0 ? {} : _b, _c = props.seriesConfig, seriesConfig = _c === void 0 ? exports.defaultSeriesConfig : _c;
    var contextValue = (0, useCharts_1.useCharts)(plugins, pluginParams, seriesConfig).contextValue;
    return <ChartContext_1.ChartContext.Provider value={contextValue}>{children}</ChartContext_1.ChartContext.Provider>;
}
