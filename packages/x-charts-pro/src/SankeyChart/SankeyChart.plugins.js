"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SANKEY_CHART_PLUGINS = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartProExport_1 = require("../internals/plugins/useChartProExport");
exports.SANKEY_CHART_PLUGINS = [
    internals_1.useChartTooltip,
    internals_1.useChartInteraction,
    internals_1.useChartHighlight,
    useChartProExport_1.useChartProExport,
    internals_1.useChartKeyboardNavigation,
];
