"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAR_CHART_PLUGINS = void 0;
var useChartZAxis_1 = require("../internals/plugins/featurePlugins/useChartZAxis");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
exports.BAR_CHART_PLUGINS = [
    useChartZAxis_1.useChartZAxis,
    useChartCartesianAxis_1.useChartCartesianAxis,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
];
