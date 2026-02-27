"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCATTER_CHART_PLUGINS = void 0;
var useChartZAxis_1 = require("../internals/plugins/featurePlugins/useChartZAxis");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartTooltip_1 = require("../internals/plugins/featurePlugins/useChartTooltip");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var useChartClosestPoint_1 = require("../internals/plugins/featurePlugins/useChartClosestPoint");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
var useChartVisibilityManager_1 = require("../internals/plugins/featurePlugins/useChartVisibilityManager");
exports.SCATTER_CHART_PLUGINS = [
    useChartZAxis_1.useChartZAxis,
    useChartBrush_1.useChartBrush,
    useChartTooltip_1.useChartTooltip,
    useChartInteraction_1.useChartInteraction,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartHighlight_1.useChartHighlight,
    useChartVisibilityManager_1.useChartVisibilityManager,
    useChartClosestPoint_1.useChartClosestPoint,
    useChartKeyboardNavigation_1.useChartKeyboardNavigation,
];
