"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PLUGINS = void 0;
var useChartCartesianAxis_1 = require("./featurePlugins/useChartCartesianAxis");
var useChartHighlight_1 = require("./featurePlugins/useChartHighlight");
var useChartInteraction_1 = require("./featurePlugins/useChartInteraction");
var useChartKeyboardNavigation_1 = require("./featurePlugins/useChartKeyboardNavigation");
var useChartClosestPoint_1 = require("./featurePlugins/useChartClosestPoint");
var useChartZAxis_1 = require("./featurePlugins/useChartZAxis");
var useChartBrush_1 = require("./featurePlugins/useChartBrush");
var useChartVisibilityManager_1 = require("./featurePlugins/useChartVisibilityManager");
var useChartTooltip_1 = require("./featurePlugins/useChartTooltip");
exports.DEFAULT_PLUGINS = [
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
