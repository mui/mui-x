"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSankeySeries = useSankeySeries;
exports.useSankeySeriesContext = useSankeySeriesContext;
exports.useSankeyLayout = useSankeyLayout;
var internals_1 = require("@mui/x-charts/internals");
function useSankeySeries(seriesIds) {
    return (0, internals_1.useSeriesOfType)('sankey', seriesIds);
}
/**
 * Get access to the internal state of sankey series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the sankey series
 */
function useSankeySeriesContext() {
    return (0, internals_1.useAllSeriesOfType)('sankey');
}
/**
 * Get access to the sankey layout.
 * @returns {SankeyLayout | undefined} the sankey layout
 */
function useSankeyLayout() {
    var _a, _b, _c;
    var store = (0, internals_1.useStore)();
    var seriesContext = useSankeySeriesContext();
    var seriesId = (_a = seriesContext === null || seriesContext === void 0 ? void 0 : seriesContext.seriesOrder) === null || _a === void 0 ? void 0 : _a[0];
    var layout = store.use(internals_1.selectorChartSeriesLayout);
    if (!seriesId) {
        return undefined;
    }
    return (_c = (_b = layout === null || layout === void 0 ? void 0 : layout.sankey) === null || _b === void 0 ? void 0 : _b[seriesId]) === null || _c === void 0 ? void 0 : _c.sankeyLayout;
}
