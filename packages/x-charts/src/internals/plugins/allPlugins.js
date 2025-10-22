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
exports.DEFAULT_PLUGINS = [
    useChartZAxis_1.useChartZAxis,
    useChartBrush_1.useChartBrush,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
    useChartClosestPoint_1.useChartClosestPoint,
    useChartKeyboardNavigation_1.useChartKeyboardNavigation,
];
