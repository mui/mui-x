"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapSVGPlot = HeatmapSVGPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var hooks_2 = require("../hooks");
var HeatmapItem_1 = require("./HeatmapItem");
var useChartHeatmapPosition_selectors_1 = require("../plugins/selectors/useChartHeatmapPosition.selectors");
var shouldRegisterPointerInteractionsGlobally_1 = require("./shouldRegisterPointerInteractionsGlobally");
var heatmapClasses_1 = require("./heatmapClasses");
var MemoHeatmapItem = React.memo(HeatmapItem_1.HeatmapItem);
var HeatmapPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiHeatmapPlot',
    slot: 'Root',
})();
function HeatmapSVGPlot(props) {
    var store = (0, internals_1.useStore)();
    var xScale = (0, hooks_1.useXScale)();
    var yScale = (0, hooks_1.useYScale)();
    var colorScale = (0, hooks_1.useZColorScale)();
    var series = (0, hooks_2.useHeatmapSeriesContext)();
    var getHighlightState = store.use(internals_1.selectorChartsHighlightStateCallback);
    var xDomain = xScale.domain();
    var yDomain = yScale.domain();
    if (!series || series.seriesOrder.length === 0) {
        return null;
    }
    var seriesToDisplay = series.series[series.seriesOrder[0]];
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, shouldRegisterPointerInteractionsGlobally_1.shouldRegisterPointerInteractionsGlobally)(props.slots, props.slotProps) ? ((0, jsx_runtime_1.jsx)(RegisterHeatmapPointerInteractions, {})) : null, (0, jsx_runtime_1.jsx)(HeatmapPlotRoot, { className: heatmapClasses_1.heatmapClasses.root, "data-series": seriesToDisplay.id, children: seriesToDisplay.data.map(function (_a) {
                    var xIndex = _a[0], yIndex = _a[1], value = _a[2];
                    var x = xScale(xDomain[xIndex]);
                    var y = yScale(yDomain[yIndex]);
                    var color = colorScale === null || colorScale === void 0 ? void 0 : colorScale(value);
                    if (x === undefined || y === undefined || !color) {
                        return null;
                    }
                    var item = {
                        type: 'heatmap',
                        seriesId: seriesToDisplay.id,
                        xIndex: xIndex,
                        yIndex: yIndex,
                    };
                    var highlightState = getHighlightState(item);
                    return ((0, jsx_runtime_1.jsx)(MemoHeatmapItem, { width: xScale.bandwidth(), height: yScale.bandwidth(), x: x, y: y, xIndex: xIndex, yIndex: yIndex, color: color, seriesId: series.seriesOrder[0], value: value, slots: props.slots, slotProps: props.slotProps, isHighlighted: highlightState === 'highlighted', isFaded: highlightState === 'faded', borderRadius: props.borderRadius }, "".concat(xIndex, "_").concat(yIndex)));
                }) })] }));
}
function RegisterHeatmapPointerInteractions() {
    (0, internals_1.useRegisterPointerInteractions)(useChartHeatmapPosition_selectors_1.selectorHeatmapItemAtPosition);
    return null;
}
