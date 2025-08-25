"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHART_CORE_PLUGINS = void 0;
var useChartAnimation_1 = require("./useChartAnimation");
var useChartDimensions_1 = require("./useChartDimensions");
var useChartExperimentalFeature_1 = require("./useChartExperimentalFeature");
var useChartId_1 = require("./useChartId");
var useChartSeries_1 = require("./useChartSeries");
var useChartInteractionListener_1 = require("./useChartInteractionListener");
/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
exports.CHART_CORE_PLUGINS = [
    useChartId_1.useChartId,
    useChartExperimentalFeature_1.useChartExperimentalFeatures,
    useChartDimensions_1.useChartDimensions,
    useChartSeries_1.useChartSeries,
    useChartInteractionListener_1.useChartInteractionListener,
    useChartAnimation_1.useChartAnimation,
];
