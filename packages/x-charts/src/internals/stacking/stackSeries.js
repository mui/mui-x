"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackingGroups = exports.StackOffset = exports.StackOrder = void 0;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var offset_1 = require("./offset");
exports.StackOrder = {
    /**
     * Series order such that the earliest series (according to the maximum value) is at the bottom.
     * */
    appearance: d3_shape_1.stackOrderAppearance,
    /**
     *  Series order such that the smallest series (according to the sum of values) is at the bottom.
     * */
    ascending: d3_shape_1.stackOrderAscending,
    /**
     * Series order such that the largest series (according to the sum of values) is at the bottom.
     */
    descending: d3_shape_1.stackOrderDescending,
    /**
     * Series order such that the earliest series (according to the maximum value) are on the inside and the later series are on the outside. This order is recommended for streamgraphs in conjunction with the wiggle offset. See Stacked Graphs—Geometry & Aesthetics by Byron & Wattenberg for more information.
     */
    insideOut: d3_shape_1.stackOrderInsideOut,
    /**
     * Given series order [0, 1, … n - 1] where n is the number of elements in series. Thus, the stack order is given by the key accessor.
     */
    none: d3_shape_1.stackOrderNone,
    /**
     * Reverse of the given series order [n - 1, n - 2, … 0] where n is the number of elements in series. Thus, the stack order is given by the reverse of the key accessor.
     */
    reverse: d3_shape_1.stackOrderReverse,
};
exports.StackOffset = {
    /**
     * Applies a zero baseline and normalizes the values for each point such that the topline is always one.
     * */
    expand: d3_shape_1.stackOffsetExpand,
    /**
     * Positive values are stacked above zero, negative values are stacked below zero, and zero values are stacked at zero.
     * */
    diverging: offset_1.offsetDiverging,
    /**
     * Applies a zero baseline.
     * */
    none: d3_shape_1.stackOffsetNone,
    /**
     * Shifts the baseline down such that the center of the streamgraph is always at zero.
     * */
    silhouette: d3_shape_1.stackOffsetSilhouette,
    /**
     * Shifts the baseline so as to minimize the weighted wiggle of layers. This offset is recommended for streamgraphs in conjunction with the inside-out order. See Stacked Graphs—Geometry & Aesthetics by Bryon & Wattenberg for more information.
     * */
    wiggle: d3_shape_1.stackOffsetWiggle,
};
/**
 * Takes a set of series and groups their ids
 * @param series the object of all bars series
 * @returns an array of groups, including the ids, the stacking order, and the stacking offset.
 */
var getStackingGroups = function (params) {
    var series = params.series, seriesOrder = params.seriesOrder, defaultStrategy = params.defaultStrategy;
    var stackingGroups = [];
    var stackIndex = {};
    seriesOrder.forEach(function (id) {
        var _a, _b;
        var _c = series[id], stack = _c.stack, stackOrder = _c.stackOrder, stackOffset = _c.stackOffset;
        if (stack === undefined) {
            stackingGroups.push({
                ids: [id],
                stackingOrder: exports.StackOrder.none,
                stackingOffset: exports.StackOffset.none,
            });
        }
        else if (stackIndex[stack] === undefined) {
            stackIndex[stack] = stackingGroups.length;
            stackingGroups.push({
                ids: [id],
                stackingOrder: exports.StackOrder[(_a = stackOrder !== null && stackOrder !== void 0 ? stackOrder : defaultStrategy === null || defaultStrategy === void 0 ? void 0 : defaultStrategy.stackOrder) !== null && _a !== void 0 ? _a : 'none'],
                stackingOffset: exports.StackOffset[(_b = stackOffset !== null && stackOffset !== void 0 ? stackOffset : defaultStrategy === null || defaultStrategy === void 0 ? void 0 : defaultStrategy.stackOffset) !== null && _b !== void 0 ? _b : 'diverging'],
            });
        }
        else {
            stackingGroups[stackIndex[stack]].ids.push(id);
            if (stackOrder !== undefined) {
                stackingGroups[stackIndex[stack]].stackingOrder = exports.StackOrder[stackOrder];
            }
            if (stackOffset !== undefined) {
                stackingGroups[stackIndex[stack]].stackingOffset = exports.StackOffset[stackOffset];
            }
        }
    });
    return stackingGroups;
};
exports.getStackingGroups = getStackingGroups;
