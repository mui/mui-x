"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartAxisSizes = exports.selectorChartBottomAxisSize = exports.selectorChartTopAxisSize = exports.selectorChartRightAxisSize = exports.selectorChartLeftAxisSize = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
function selectAxisSize(axes, axesGap, position) {
    var _a;
    var axesSize = 0;
    var nbOfAxes = 0;
    for (var _i = 0, _b = axes !== null && axes !== void 0 ? axes : []; _i < _b.length; _i++) {
        var axis = _b[_i];
        if (axis.position !== position) {
            continue;
        }
        var axisSize = position === 'top' || position === 'bottom'
            ? axis.height
            : axis.width;
        axesSize += (axisSize || 0) + (((_a = axis.zoom) === null || _a === void 0 ? void 0 : _a.slider.enabled) ? axis.zoom.slider.size : 0);
        nbOfAxes += 1;
    }
    return axesSize + axesGap * Math.max(0, nbOfAxes - 1);
}
exports.selectorChartLeftAxisSize = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, useChartCartesianAxisLayout_selectors_1.selectorChartCartesianAxesGap, function selectorChartLeftAxisSize(yAxis, axesGap) {
    return selectAxisSize(yAxis, axesGap, 'left');
});
exports.selectorChartRightAxisSize = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, useChartCartesianAxisLayout_selectors_1.selectorChartCartesianAxesGap, function selectorChartRightAxisSize(yAxis, axesGap) {
    return selectAxisSize(yAxis, axesGap, 'right');
});
exports.selectorChartTopAxisSize = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartCartesianAxesGap, function selectorChartTopAxisSize(xAxis, axesGap) {
    return selectAxisSize(xAxis, axesGap, 'top');
});
exports.selectorChartBottomAxisSize = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartCartesianAxesGap, function selectorChartBottomAxisSize(xAxis, axesGap) {
    return selectAxisSize(xAxis, axesGap, 'bottom');
});
exports.selectorChartAxisSizes = (0, store_1.createSelectorMemoized)(exports.selectorChartLeftAxisSize, exports.selectorChartRightAxisSize, exports.selectorChartTopAxisSize, exports.selectorChartBottomAxisSize, function selectorChartAxisSizes(left, right, top, bottom) {
    return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
});
