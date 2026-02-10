"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonNextFocusItem_1 = require("../../internals/commonNextFocusItem");
var outSeriesTypes = new Set(['pie']);
var keyboardFocusHandler = function (event) {
    switch (event.key) {
        case 'ArrowRight':
            return (0, commonNextFocusItem_1.createGetNextIndexFocusedItem)(outSeriesTypes);
        case 'ArrowLeft':
            return (0, commonNextFocusItem_1.createGetPreviousIndexFocusedItem)(outSeriesTypes);
        case 'ArrowDown':
            return (0, commonNextFocusItem_1.createGetPreviousSeriesFocusedItem)(outSeriesTypes);
        case 'ArrowUp':
            return (0, commonNextFocusItem_1.createGetNextSeriesFocusedItem)(outSeriesTypes);
        default:
            return null;
    }
};
exports.default = keyboardFocusHandler;
