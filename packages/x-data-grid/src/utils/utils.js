"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIf = exports.clamp = void 0;
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.localStorageAvailable = localStorageAvailable;
exports.escapeRegExp = escapeRegExp;
exports.range = range;
exports.createRandomNumberGenerator = createRandomNumberGenerator;
exports.deepClone = deepClone;
exports.eslintUseValue = eslintUseValue;
function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function localStorageAvailable() {
    try {
        // Incognito mode might reject access to the localStorage for security reasons.
        // window isn't defined on Node.js
        // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
        var key = '__some_random_key_you_are_not_going_to_use__';
        window.localStorage.setItem(key, key);
        window.localStorage.removeItem(key);
        return true;
    }
    catch (err) {
        return false;
    }
}
function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
/**
 * Follows the CSS specification behavior for min and max
 * If min > max, then the min have priority
 */
var clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
};
exports.clamp = clamp;
/**
 * Create an array containing the range [from, to[
 */
function range(from, to) {
    return Array.from({ length: to - from }).map(function (_, i) { return from + i; });
}
// Pseudo random number. See https://stackoverflow.com/a/47593316
function mulberry32(a) {
    return function () {
        /* eslint-disable */
        var t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        /* eslint-enable */
    };
}
/**
 * Create a random number generator from a seed. The seed
 * ensures that the random number generator produces the
 * same sequence of 'random' numbers on every render. It
 * returns a function that generates a random number between
 * a specified min and max.
 */
function createRandomNumberGenerator(seed) {
    var random = mulberry32(seed);
    return function (min, max) { return min + (max - min) * random(); };
}
function deepClone(obj) {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Mark a value as used so eslint doesn't complain. Use this instead
 * of a `eslint-disable-next-line react-hooks/exhaustive-deps` because
 * that hint disables checks on all values instead of just one.
 */
function eslintUseValue(_) { }
var runIf = function (condition, fn) { return function (params) {
    if (condition) {
        fn(params);
    }
}; };
exports.runIf = runIf;
