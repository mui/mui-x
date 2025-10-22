"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_CHART_PLUGINS = void 0;
var useChartZAxis_1 = require("../internals/plugins/featurePlugins/useChartZAxis");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
exports.LINE_CHART_PLUGINS = [
    useChartZAxis_1.useChartZAxis,
    useChartBrush_1.useChartBrush,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
    useChartKeyboardNavigation_1.useChartKeyboardNavigation,
];
