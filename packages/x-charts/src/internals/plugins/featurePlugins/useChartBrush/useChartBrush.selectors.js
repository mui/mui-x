"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorBrushShouldPreventTooltip = exports.selectorBrushShouldPreventAxisHighlight = exports.selectorIsBrushSelectionActive = exports.selectorIsBrushEnabled = exports.selectorBrushConfig = exports.selectorBrushConfigZoom = exports.selectorBrushConfigNoZoom = exports.selectorBrushState = exports.selectorBrushCurrentY = exports.selectorBrushCurrentX = exports.selectorBrushStartY = exports.selectorBrushStartX = exports.selectorBrushCurrent = exports.selectorBrushStart = exports.selectorBrush = void 0;
var selectors_1 = require("../../utils/selectors");
var useChartCartesianAxis_1 = require("../useChartCartesianAxis");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var selectorBrush = function (state) {
    return state.brush;
};
exports.selectorBrush = selectorBrush;
exports.selectorBrushStart = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { return brush === null || brush === void 0 ? void 0 : brush.start; });
exports.selectorBrushCurrent = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { return brush === null || brush === void 0 ? void 0 : brush.current; });
exports.selectorBrushStartX = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { var _a, _b; return (_b = (_a = brush === null || brush === void 0 ? void 0 : brush.start) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : null; });
exports.selectorBrushStartY = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { var _a, _b; return (_b = (_a = brush === null || brush === void 0 ? void 0 : brush.start) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : null; });
exports.selectorBrushCurrentX = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { var _a, _b; return (_b = (_a = brush === null || brush === void 0 ? void 0 : brush.current) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : null; });
exports.selectorBrushCurrentY = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { var _a, _b; return (_b = (_a = brush === null || brush === void 0 ? void 0 : brush.current) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : null; });
exports.selectorBrushState = (0, selectors_1.createSelector)([exports.selectorBrushStartX, exports.selectorBrushStartY, exports.selectorBrushCurrentX, exports.selectorBrushCurrentY], function (startX, startY, currentX, currentY) {
    if (startX === null || startY === null || currentX === null || currentY === null) {
        return null;
    }
    return {
        start: { x: startX, y: startY },
        current: { x: currentX, y: currentY },
    };
});
exports.selectorBrushConfigNoZoom = (0, selectors_1.createSelector)([useChartSeries_1.selectorChartSeriesProcessed], function (series) {
    var hasHorizontal = false;
    var isBothDirections = false;
    if (series) {
        Object.entries(series).forEach(function (_a) {
            var seriesType = _a[0], seriesData = _a[1];
            if (Object.values(seriesData.series).some(function (s) { return s.layout === 'horizontal'; })) {
                hasHorizontal = true;
            }
            if (seriesType === 'scatter' && seriesData.seriesOrder.length > 0) {
                isBothDirections = true;
            }
        });
    }
    if (isBothDirections) {
        return 'xy';
    }
    if (hasHorizontal) {
        return 'y';
    }
    return 'x';
});
exports.selectorBrushConfigZoom = (0, selectors_1.createSelector)([useChartCartesianAxis_1.selectorChartZoomOptionsLookup], function (optionsLookup) {
    var hasX = false;
    var hasY = false;
    Object.values(optionsLookup).forEach(function (options) {
        if (options.axisDirection === 'y') {
            hasY = true;
        }
        if (options.axisDirection === 'x') {
            hasX = true;
        }
    });
    if (hasX && hasY) {
        return 'xy';
    }
    if (hasY) {
        return 'y';
    }
    if (hasX) {
        return 'x';
    }
    return null;
});
exports.selectorBrushConfig = (0, selectors_1.createSelector)([exports.selectorBrushConfigNoZoom, exports.selectorBrushConfigZoom], function (configNoZoom, configZoom) { return configZoom !== null && configZoom !== void 0 ? configZoom : configNoZoom; });
exports.selectorIsBrushEnabled = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) { return brush === null || brush === void 0 ? void 0 : brush.enabled; });
exports.selectorIsBrushSelectionActive = (0, selectors_1.createSelector)([exports.selectorBrush], function (brush) {
    return (brush === null || brush === void 0 ? void 0 : brush.enabled) && (brush === null || brush === void 0 ? void 0 : brush.start) !== null && (brush === null || brush === void 0 ? void 0 : brush.current) !== null;
});
exports.selectorBrushShouldPreventAxisHighlight = (0, selectors_1.createSelector)([exports.selectorBrush, exports.selectorIsBrushSelectionActive], function (brush, isBrushSelectionActive) { return isBrushSelectionActive && (brush === null || brush === void 0 ? void 0 : brush.preventHighlight); });
exports.selectorBrushShouldPreventTooltip = (0, selectors_1.createSelector)([exports.selectorBrush, exports.selectorIsBrushSelectionActive], function (brush, isBrushSelectionActive) { return isBrushSelectionActive && (brush === null || brush === void 0 ? void 0 : brush.preventTooltip); });
