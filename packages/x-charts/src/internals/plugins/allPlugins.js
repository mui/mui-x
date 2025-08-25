"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PLUGINS = void 0;
var useChartCartesianAxis_1 = require("./featurePlugins/useChartCartesianAxis");
var useChartHighlight_1 = require("./featurePlugins/useChartHighlight");
var useChartInteraction_1 = require("./featurePlugins/useChartInteraction");
var useChartVoronoi_1 = require("./featurePlugins/useChartVoronoi");
var useChartZAxis_1 = require("./featurePlugins/useChartZAxis");
exports.DEFAULT_PLUGINS = [
    useChartZAxis_1.useChartZAxis,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
    useChartVoronoi_1.useChartVoronoi,
];
