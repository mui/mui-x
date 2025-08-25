"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldCellShowLeftBorder = exports.shouldCellShowRightBorder = void 0;
var constants_1 = require("../internals/constants");
var shouldCellShowRightBorder = function (pinnedPosition, indexInSection, sectionLength, showCellVerticalBorderRootProp, gridHasFiller) {
    var isSectionLastCell = indexInSection === sectionLength - 1;
    if (pinnedPosition === constants_1.PinnedColumnPosition.LEFT && isSectionLastCell) {
        return true;
    }
    if (showCellVerticalBorderRootProp) {
        if (pinnedPosition === constants_1.PinnedColumnPosition.LEFT) {
            return true;
        }
        if (pinnedPosition === constants_1.PinnedColumnPosition.RIGHT) {
            return !isSectionLastCell;
        }
        // pinnedPosition === undefined, middle section
        return !isSectionLastCell || gridHasFiller;
    }
    return false;
};
exports.shouldCellShowRightBorder = shouldCellShowRightBorder;
var shouldCellShowLeftBorder = function (pinnedPosition, indexInSection) {
    return pinnedPosition === constants_1.PinnedColumnPosition.RIGHT && indexInSection === 0;
};
exports.shouldCellShowLeftBorder = shouldCellShowLeftBorder;
