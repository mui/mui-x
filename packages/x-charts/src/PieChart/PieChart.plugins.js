"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIE_CHART_PLUGINS = void 0;
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
exports.PIE_CHART_PLUGINS = [
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
];
