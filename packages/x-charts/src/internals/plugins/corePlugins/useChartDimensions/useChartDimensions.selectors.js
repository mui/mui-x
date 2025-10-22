"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartContainerSize = exports.selectorChartPropsSize = exports.selectorChartDrawingArea = exports.selectorChartMargin = exports.selectorChartDimensionsState = void 0;
var selectors_1 = require("../../utils/selectors");
var useChartAxisSize_selectors_1 = require("../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors");
var selectorChartDimensionsState = function (state) { return state.dimensions; };
exports.selectorChartDimensionsState = selectorChartDimensionsState;
var selectorChartMargin = function (state) {
    return state.dimensions.margin;
};
exports.selectorChartMargin = selectorChartMargin;
var selectorChartWidth = function (state) {
    return state.dimensions.width;
};
var selectorChartHeight = function (state) {
    return state.dimensions.height;
};
var selectorChartTopMargin = function (state) {
    return state.dimensions.margin.top;
};
var selectorChartRightMargin = function (state) {
    return state.dimensions.margin.right;
};
var selectorChartBottomMargin = function (state) {
    return state.dimensions.margin.bottom;
};
var selectorChartLeftMargin = function (state) {
    return state.dimensions.margin.left;
};
exports.selectorChartDrawingArea = (0, selectors_1.createSelector)([
    selectorChartWidth,
    selectorChartHeight,
    selectorChartTopMargin,
    selectorChartRightMargin,
    selectorChartBottomMargin,
    selectorChartLeftMargin,
    useChartAxisSize_selectors_1.selectorChartTopAxisSize,
    useChartAxisSize_selectors_1.selectorChartRightAxisSize,
    useChartAxisSize_selectors_1.selectorChartBottomAxisSize,
    useChartAxisSize_selectors_1.selectorChartLeftAxisSize,
], function (width, height, marginTop, marginRight, marginBottom, marginLeft, axisSizeTop, axisSizeRight, axisSizeBottom, axisSizeLeft) { return ({
    width: width - marginLeft - marginRight - axisSizeLeft - axisSizeRight,
    left: marginLeft + axisSizeLeft,
    right: marginRight + axisSizeRight,
    height: height - marginTop - marginBottom - axisSizeTop - axisSizeBottom,
    top: marginTop + axisSizeTop,
    bottom: marginBottom + axisSizeBottom,
}); });
exports.selectorChartPropsSize = (0, selectors_1.createSelector)([exports.selectorChartDimensionsState], function (dimensionsState) { return ({
    width: dimensionsState.propsWidth,
    height: dimensionsState.propsHeight,
}); });
exports.selectorChartContainerSize = (0, selectors_1.createSelector)([selectorChartWidth, selectorChartHeight], function (width, height) { return ({
    width: width,
    height: height,
}); });
