"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPinnedStyle = attachPinnedStyle;
var rtlFlipSide_1 = require("../../utils/rtlFlipSide");
function attachPinnedStyle(style, isRtl, pinnedPosition, pinnedOffset) {
    var side = (0, rtlFlipSide_1.rtlFlipSide)(pinnedPosition, isRtl);
    if (!side || pinnedOffset === undefined) {
        return style;
    }
    style[side] = pinnedOffset;
    return style;
}
