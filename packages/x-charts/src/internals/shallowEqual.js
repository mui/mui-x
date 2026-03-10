"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowEqual = shallowEqual;
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 *
 * Source: https://github.com/facebook/react/blob/c2a196174763e0b4f16ed1c512ed4442b062395e/packages/shared/shallowEqual.js#L18
 */
function shallowEqual(objA, objB) {
    if (Object.is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i += 1) {
        var currentKey = keysA[i];
        if (!Object.prototype.hasOwnProperty.call(objB, currentKey) ||
            // @ts-ignore
            !Object.is(objA[currentKey], objB[currentKey])) {
            return false;
        }
    }
    return true;
}
