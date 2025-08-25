"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinnedCellOffset = void 0;
var constants_1 = require("../constants");
var getPinnedCellOffset = function (pinnedPosition, computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth) {
    var pinnedOffset;
    switch (pinnedPosition) {
        case constants_1.PinnedColumnPosition.LEFT:
            pinnedOffset = columnPositions[columnIndex];
            break;
        case constants_1.PinnedColumnPosition.RIGHT:
            pinnedOffset =
                columnsTotalWidth - columnPositions[columnIndex] - computedWidth + scrollbarWidth;
            break;
        default:
            pinnedOffset = undefined;
            break;
    }
    // XXX: fix this properly
    if (Number.isNaN(pinnedOffset)) {
        pinnedOffset = undefined;
    }
    return pinnedOffset;
};
exports.getPinnedCellOffset = getPinnedCellOffset;
