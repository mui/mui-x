"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartPropsHeight = exports.selectorChartPropsWidth = exports.selectorChartSvgHeight = exports.selectorChartSvgWidth = exports.selectorChartDrawingArea = exports.selectorChartMargin = exports.selectorChartDimensionsState = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartAxisSize_selectors_1 = require("../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors");
var selectorChartDimensionsState = function (state) { return state.dimensions; };
exports.selectorChartDimensionsState = selectorChartDimensionsState;
var selectorChartMargin = function (state) {
    return state.dimensions.margin;
};
exports.selectorChartMargin = selectorChartMargin;
exports.selectorChartDrawingArea = (0, store_1.createSelectorMemoized)(exports.selectorChartDimensionsState, exports.selectorChartMargin, useChartAxisSize_selectors_1.selectorChartAxisSizes, function selectorChartDrawingArea(_a, _b, _c) {
    var width = _a.width, height = _a.height;
    var marginTop = _b.top, marginRight = _b.right, marginBottom = _b.bottom, marginLeft = _b.left;
    var axisSizeLeft = _c.left, axisSizeRight = _c.right, axisSizeTop = _c.top, axisSizeBottom = _c.bottom;
    return {
        width: width - marginLeft - marginRight - axisSizeLeft - axisSizeRight,
        left: marginLeft + axisSizeLeft,
        right: marginRight + axisSizeRight,
        height: height - marginTop - marginBottom - axisSizeTop - axisSizeBottom,
        top: marginTop + axisSizeTop,
        bottom: marginBottom + axisSizeBottom,
    };
});
exports.selectorChartSvgWidth = (0, store_1.createSelector)(exports.selectorChartDimensionsState, function (dimensionsState) { return dimensionsState.width; });
exports.selectorChartSvgHeight = (0, store_1.createSelector)(exports.selectorChartDimensionsState, function (dimensionsState) { return dimensionsState.height; });
exports.selectorChartPropsWidth = (0, store_1.createSelector)(exports.selectorChartDimensionsState, function (dimensionsState) { return dimensionsState.propsWidth; });
exports.selectorChartPropsHeight = (0, store_1.createSelector)(exports.selectorChartDimensionsState, function (dimensionsState) { return dimensionsState.propsHeight; });
