"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMinMax = findMinMax;
function findMinMax(data) {
    var min = Infinity;
    var max = -Infinity;
    for (var _i = 0, _a = data !== null && data !== void 0 ? data : []; _i < _a.length; _i++) {
        var value = _a[_i];
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    }
    return [min, max];
}
