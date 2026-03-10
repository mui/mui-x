"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RADAR_PLUGINS = void 0;
var useChartPolarAxis_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var useChartTooltip_1 = require("../internals/plugins/featurePlugins/useChartTooltip");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var useChartVisibilityManager_1 = require("../internals/plugins/featurePlugins/useChartVisibilityManager");
exports.RADAR_PLUGINS = [
    useChartTooltip_1.useChartTooltip,
    useChartInteraction_1.useChartInteraction,
    useChartPolarAxis_1.useChartPolarAxis,
    useChartHighlight_1.useChartHighlight,
    useChartKeyboardNavigation_1.useChartKeyboardNavigation,
    useChartVisibilityManager_1.useChartVisibilityManager,
];
