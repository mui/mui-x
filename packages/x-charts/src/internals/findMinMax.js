"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMinMax = findMinMax;
/**
 * Efficiently finds the minimum and maximum values in an array of numbers.
 * This functions helps preventing maximum call stack errors when dealing with large datasets.
 *
 * @param data The array of numbers to evaluate
 * @returns [min, max] as numbers
 */
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
