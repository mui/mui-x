"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RADAR_PLUGINS = void 0;
var useChartPolarAxis_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
exports.RADAR_PLUGINS = [useChartPolarAxis_1.useChartPolarAxis, useChartInteraction_1.useChartInteraction, useChartHighlight_1.useChartHighlight];
