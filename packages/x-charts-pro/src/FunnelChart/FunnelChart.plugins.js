"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUNNEL_CHART_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("../internals/plugins/useChartProExport");
var useChartFunnelAxis_1 = require("./funnelAxisPlugin/useChartFunnelAxis");
exports.FUNNEL_CHART_PLUGINS = [
    useChartFunnelAxis_1.useChartFunnelAxis,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProExport_1.useChartProExport,
];
