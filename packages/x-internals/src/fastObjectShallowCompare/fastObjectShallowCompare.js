"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastObjectShallowCompare = fastObjectShallowCompare;
var is = Object.is;
/**
 * Fast shallow compare for objects.
 * @returns true if objects are equal.
 */
function fastObjectShallowCompare(a, b) {
    if (a === b) {
        return true;
    }
    if (!(a instanceof Object) || !(b instanceof Object)) {
        return false;
    }
    var aLength = 0;
    var bLength = 0;
    /* eslint-disable guard-for-in */
    for (var key in a) {
        aLength += 1;
        if (!is(a[key], b[key])) {
            return false;
        }
        if (!(key in b)) {
            return false;
        }
    }
    /* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
    for (var _ in b) {
        bLength += 1;
    }
    return aLength === bLength;
}
