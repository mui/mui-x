"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommonKeyboardFocusHandler = createCommonKeyboardFocusHandler;
var commonNextFocusItem_1 = require("./commonNextFocusItem");
/**
 * Create a keyboard focus handler for common use cases where focused item are defined by the series is and data index.
 */
function createCommonKeyboardFocusHandler(outSeriesTypes, allowCycles) {
    var keyboardFocusHandler = function (event) {
        switch (event.key) {
            case 'ArrowRight':
                return (0, commonNextFocusItem_1.createGetNextIndexFocusedItem)(outSeriesTypes, allowCycles);
            case 'ArrowLeft':
                return (0, commonNextFocusItem_1.createGetPreviousIndexFocusedItem)(outSeriesTypes, allowCycles);
            case 'ArrowDown':
                return (0, commonNextFocusItem_1.createGetPreviousSeriesFocusedItem)(outSeriesTypes);
            case 'ArrowUp':
                return (0, commonNextFocusItem_1.createGetNextSeriesFocusedItem)(outSeriesTypes);
            default:
                return null;
        }
    };
    return keyboardFocusHandler;
}
