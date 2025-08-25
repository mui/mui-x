"use strict";
// This file should be removed after creating all plugins in favor of a file per chart type.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PLUGINS = exports.ALL_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("./useChartProExport");
var useChartProZoom_1 = require("./useChartProZoom");
exports.ALL_PLUGINS = [
    internals_1.useChartZAxis,
    internals_1.useChartCartesianAxis,
    internals_1.useChartPolarAxis,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProZoom_1.useChartProZoom,
    useChartProExport_1.useChartProExport,
];
exports.DEFAULT_PLUGINS = [
    internals_1.useChartZAxis,
    internals_1.useChartCartesianAxis,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProZoom_1.useChartProZoom,
    useChartProExport_1.useChartProExport,
];
