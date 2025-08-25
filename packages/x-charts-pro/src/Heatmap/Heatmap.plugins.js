"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEATMAP_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("../internals/plugins/useChartProExport");
exports.HEATMAP_PLUGINS = [
    internals_1.useChartZAxis,
    internals_1.useChartCartesianAxis,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProExport_1.useChartProExport,
];
