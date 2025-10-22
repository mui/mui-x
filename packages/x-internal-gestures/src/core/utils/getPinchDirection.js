"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinchDirection = void 0;
var DIRECTION_THRESHOLD = 0;
var getPinchDirection = function (velocity) {
    if (velocity > DIRECTION_THRESHOLD) {
        return 1; // Zooming in
    }
    if (velocity < -DIRECTION_THRESHOLD) {
        return -1; // Zooming out
    }
    return 0; // No significant movement
};
exports.getPinchDirection = getPinchDirection;
