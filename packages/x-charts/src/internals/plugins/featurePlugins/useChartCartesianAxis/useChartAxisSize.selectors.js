"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartBottomAxisSize = exports.selectorChartTopAxisSize = exports.selectorChartRightAxisSize = exports.selectorChartLeftAxisSize = void 0;
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
var selectors_1 = require("../../utils/selectors");
exports.selectorChartLeftAxisSize = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis], function (yAxis) {
    return (yAxis !== null && yAxis !== void 0 ? yAxis : []).reduce(function (acc, axis) {
        var _a;
        return axis.position === 'left'
            ? acc + (axis.width || 0) + (((_a = axis.zoom) === null || _a === void 0 ? void 0 : _a.slider.enabled) ? axis.zoom.slider.size : 0)
            : acc;
    }, 0);
});
exports.selectorChartRightAxisSize = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis], function (yAxis) {
    return (yAxis !== null && yAxis !== void 0 ? yAxis : []).reduce(function (acc, axis) {
        var _a;
        return axis.position === 'right'
            ? acc + (axis.width || 0) + (((_a = axis.zoom) === null || _a === void 0 ? void 0 : _a.slider.enabled) ? axis.zoom.slider.size : 0)
            : acc;
    }, 0);
});
exports.selectorChartTopAxisSize = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis], function (xAxis) {
    return (xAxis !== null && xAxis !== void 0 ? xAxis : []).reduce(function (acc, axis) {
        var _a;
        return axis.position === 'top'
            ? acc + (axis.height || 0) + (((_a = axis.zoom) === null || _a === void 0 ? void 0 : _a.slider.enabled) ? axis.zoom.slider.size : 0)
            : acc;
    }, 0);
});
exports.selectorChartBottomAxisSize = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis], function (xAxis) {
    return (xAxis !== null && xAxis !== void 0 ? xAxis : []).reduce(function (acc, axis) {
        var _a;
        return axis.position === 'bottom'
            ? acc + (axis.height || 0) + (((_a = axis.zoom) === null || _a === void 0 ? void 0 : _a.slider.enabled) ? axis.zoom.slider.size : 0)
            : acc;
    }, 0);
});
