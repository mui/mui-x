"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIE_CHART_PLUGINS = void 0;
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartTooltip_1 = require("../internals/plugins/featurePlugins/useChartTooltip");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var useChartVisibilityManager_1 = require("../internals/plugins/featurePlugins/useChartVisibilityManager");
exports.PIE_CHART_PLUGINS = [
    useChartTooltip_1.useChartTooltip,
    useChartInteraction_1.useChartInteraction,
    useChartHighlight_1.useChartHighlight,
    useChartVisibilityManager_1.useChartVisibilityManager,
    useChartKeyboardNavigation_1.useChartKeyboardNavigation,
];
