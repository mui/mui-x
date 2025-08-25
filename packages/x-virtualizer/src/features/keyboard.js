"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
var dimensions_1 = require("./dimensions");
var virtualization_1 = require("./virtualization");
/* eslint-disable import/export, @typescript-eslint/no-redeclare */
var selectors = {};
exports.Keyboard = {
    initialize: initializeState,
    use: useKeyboard,
    selectors: selectors,
};
function initializeState(_params) {
    return {};
}
function useKeyboard(store, params, _api) {
    var getViewportPageSize = function () {
        var dimensions = dimensions_1.Dimensions.selectors.dimensions(store.state);
        if (!dimensions.isReady) {
            return 0;
        }
        // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
        // to find out the maximum number of rows that can fit in the visible part of the grid
        if (params.getRowHeight) {
            var renderContext = virtualization_1.Virtualization.selectors.renderContext(store.state);
            var viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;
            return Math.min(viewportPageSize - 1, params.rows.length);
        }
        var maximumPageSizeWithoutScrollBar = Math.floor(dimensions.viewportInnerSize.height / dimensions.rowHeight);
        return Math.min(maximumPageSizeWithoutScrollBar, params.rows.length);
    };
    return {
        getViewportPageSize: getViewportPageSize,
    };
}
