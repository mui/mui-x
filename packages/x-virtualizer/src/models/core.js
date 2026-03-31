/* eslint-disable @typescript-eslint/no-redeclare */
export const Size = {
    EMPTY: { width: 0, height: 0 },
    equals: (a, b) => a.width === b.width && a.height === b.height,
};
export const PinnedRows = {
    EMPTY: { top: [], bottom: [] },
};
export const PinnedColumns = {
    EMPTY: { left: [], right: [] },
};
export const ScrollPosition = {
    EMPTY: { top: 0, left: 0 },
    equals: (a, b) => a.top === b.top && a.left === b.left,
};
export var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["NONE"] = 0] = "NONE";
    ScrollDirection[ScrollDirection["UP"] = 1] = "UP";
    ScrollDirection[ScrollDirection["DOWN"] = 2] = "DOWN";
    ScrollDirection[ScrollDirection["LEFT"] = 3] = "LEFT";
    ScrollDirection[ScrollDirection["RIGHT"] = 4] = "RIGHT";
})(ScrollDirection || (ScrollDirection = {}));
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
})(ScrollDirection || (ScrollDirection = {}));
