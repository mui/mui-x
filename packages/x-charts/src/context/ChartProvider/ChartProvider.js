"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartProvider = ChartProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useCharts_1 = require("../../internals/store/useCharts");
var ChartContext_1 = require("./ChartContext");
var useChartCartesianAxis_1 = require("../../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartTooltip_1 = require("../../internals/plugins/featurePlugins/useChartTooltip");
var useChartInteraction_1 = require("../../internals/plugins/featurePlugins/useChartInteraction");
var useChartZAxis_1 = require("../../internals/plugins/featurePlugins/useChartZAxis");
var useChartHighlight_1 = require("../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight");
// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
var defaultPlugins = [
    useChartZAxis_1.useChartZAxis,
    useChartTooltip_1.useChartTooltip,
    useChartInteraction_1.useChartInteraction,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartHighlight_1.useChartHighlight,
];
function ChartProvider(props) {
    var children = props.children, _a = props.plugins, plugins = _a === void 0 ? defaultPlugins : _a, _b = props.pluginParams, pluginParams = _b === void 0 ? {} : _b;
    var contextValue = (0, useCharts_1.useCharts)(plugins, pluginParams).contextValue;
    return (0, jsx_runtime_1.jsx)(ChartContext_1.ChartContext.Provider, { value: contextValue, children: children });
}
