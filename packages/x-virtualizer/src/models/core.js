"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollDirection = exports.PinnedColumns = exports.PinnedRows = exports.Size = void 0;
exports.Size = {
    EMPTY: { width: 0, height: 0 },
    equals: function (a, b) { return a.width === b.width && a.height === b.height; },
};
exports.PinnedRows = {
    EMPTY: { top: [], bottom: [] },
};
exports.PinnedColumns = {
    EMPTY: { left: [], right: [] },
};
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["NONE"] = 0] = "NONE";
    ScrollDirection[ScrollDirection["UP"] = 1] = "UP";
    ScrollDirection[ScrollDirection["DOWN"] = 2] = "DOWN";
    ScrollDirection[ScrollDirection["LEFT"] = 3] = "LEFT";
    ScrollDirection[ScrollDirection["RIGHT"] = 4] = "RIGHT";
})(ScrollDirection || (exports.ScrollDirection = ScrollDirection = {}));
(function (ScrollDirection) {
    function forDelta(dx, dy) {
        if (dx === 0 && dy === 0) {
            return ScrollDirection.NONE;
        }
        /* eslint-disable */
        if (Math.abs(dy) >= Math.abs(dx)) {
            if (dy > 0) {
                return ScrollDirection.DOWN;
            }
            else {
                return ScrollDirection.UP;
            }
        }
        else {
            if (dx > 0) {
                return ScrollDirection.RIGHT;
            }
            else {
                return ScrollDirection.LEFT;
            }
        }
        /* eslint-enable */
    }
    ScrollDirection.forDelta = forDelta;
})(ScrollDirection || (exports.ScrollDirection = ScrollDirection = {}));
