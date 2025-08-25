"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridHasBottomFillerSelector = exports.gridVerticalScrollbarWidthSelector = exports.gridHorizontalScrollbarHeightSelector = exports.gridHeaderFilterHeightSelector = exports.gridGroupHeaderHeightSelector = exports.gridHeaderHeightSelector = exports.gridHasFillerSelector = exports.gridHasScrollYSelector = exports.gridHasScrollXSelector = exports.gridContentHeightSelector = exports.gridRowHeightSelector = exports.gridColumnsTotalWidthSelector = exports.gridDimensionsSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridDimensionsSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.dimensions; });
/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
exports.gridColumnsTotalWidthSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.columnsTotalWidth; });
exports.gridRowHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.rowHeight; });
exports.gridContentHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.contentSize.height; });
exports.gridHasScrollXSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.hasScrollX; });
exports.gridHasScrollYSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.hasScrollY; });
exports.gridHasFillerSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width; });
exports.gridHeaderHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.headerHeight; });
exports.gridGroupHeaderHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.groupHeaderHeight; });
exports.gridHeaderFilterHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return dimensions.headerFilterHeight; });
exports.gridHorizontalScrollbarHeightSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return (dimensions.hasScrollX ? dimensions.scrollbarSize : 0); });
exports.gridVerticalScrollbarWidthSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, function (dimensions) { return (dimensions.hasScrollY ? dimensions.scrollbarSize : 0); });
exports.gridHasBottomFillerSelector = (0, createSelector_1.createSelector)(exports.gridDimensionsSelector, exports.gridHorizontalScrollbarHeightSelector, function (dimensions, height) {
    var needsLastRowBorder = dimensions.viewportOuterSize.height - dimensions.minimumSize.height > 0;
    if (height === 0 && !needsLastRowBorder) {
        return false;
    }
    return true;
});
