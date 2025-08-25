"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_CHART_PRO_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("../internals/plugins/useChartProExport");
var useChartProZoom_1 = require("../internals/plugins/useChartProZoom");
exports.LINE_CHART_PRO_PLUGINS = [
    internals_1.useChartZAxis,
    internals_1.useChartCartesianAxis,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProZoom_1.useChartProZoom,
    useChartProExport_1.useChartProExport,
];
