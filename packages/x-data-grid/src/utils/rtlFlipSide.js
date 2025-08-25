"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtlFlipSide = void 0;
var constants_1 = require("../internals/constants");
var rtlFlipSide = function (position, isRtl) {
    if (!position) {
        return undefined;
    }
    if (!isRtl) {
        if (position === constants_1.PinnedColumnPosition.LEFT) {
            return 'left';
        }
        if (position === constants_1.PinnedColumnPosition.RIGHT) {
            return 'right';
        }
    }
    else {
        if (position === constants_1.PinnedColumnPosition.LEFT) {
            return 'right';
        }
        if (position === constants_1.PinnedColumnPosition.RIGHT) {
            return 'left';
        }
    }
    return undefined;
};
exports.rtlFlipSide = rtlFlipSide;
