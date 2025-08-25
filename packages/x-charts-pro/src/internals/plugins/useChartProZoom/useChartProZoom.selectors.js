"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartCanZoomIn = exports.selectorChartCanZoomOut = exports.selectorChartAxisZoomData = exports.selectorChartZoomIsEnabled = exports.selectorChartZoomIsInteracting = exports.selectorChartZoomState = void 0;
var internals_1 = require("@mui/x-charts/internals");
var selectorChartZoomState = function (state) {
    return state.zoom;
};
exports.selectorChartZoomState = selectorChartZoomState;
exports.selectorChartZoomIsInteracting = (0, internals_1.createSelector)([exports.selectorChartZoomState], function (zoom) { return zoom.isInteracting; });
exports.selectorChartZoomIsEnabled = (0, internals_1.createSelector)([internals_1.selectorChartZoomOptionsLookup], function (optionsLookup) { return Object.keys(optionsLookup).length > 0; });
exports.selectorChartAxisZoomData = (0, internals_1.createSelector)([internals_1.selectorChartZoomMap, function (state, axisId) { return axisId; }], function (zoomMap, axisId) { return zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axisId); });
exports.selectorChartCanZoomOut = (0, internals_1.createSelector)([exports.selectorChartZoomState, internals_1.selectorChartZoomOptionsLookup], function (zoomState, zoomOptions) {
    return zoomState.zoomData.every(function (zoomData) {
        var span = zoomData.end - zoomData.start;
        var options = zoomOptions[zoomData.axisId];
        return ((zoomData.start === options.minStart && zoomData.end === options.maxEnd) ||
            span === options.maxSpan);
    });
});
exports.selectorChartCanZoomIn = (0, internals_1.createSelector)([exports.selectorChartZoomState, internals_1.selectorChartZoomOptionsLookup], function (zoomState, zoomOptions) {
    return zoomState.zoomData.every(function (zoomData) {
        var span = zoomData.end - zoomData.start;
        var options = zoomOptions[zoomData.axisId];
        return span === options.minSpan;
    });
});
