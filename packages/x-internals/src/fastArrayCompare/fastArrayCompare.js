"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastArrayCompare = fastArrayCompare;
/**
 * A fast array comparison function that compares two arrays for equality.
 *
 * Assumes that the arrays are ordered and contain only primitive values.
 *
 * It is faster than `fastObjectShallowCompare` for arrays.
 *
 * Returns true for instance equality, even if inputs are not arrays.
 *
 * @returns true if arrays contain the same elements in the same order, false otherwise.
 */
function fastArrayCompare(a, b) {
    if (a === b) {
        return true;
    }
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }
    var i = a.length;
    if (i !== b.length) {
        return false;
    }
    // eslint-disable-next-line no-plusplus
    while (i--) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
