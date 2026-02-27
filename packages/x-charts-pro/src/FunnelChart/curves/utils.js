"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerpY = exports.lerpX = exports.min = exports.max = void 0;
var max = function (numbers) { return Math.max.apply(Math, __spreadArray(__spreadArray([], numbers, false), [-Infinity], false)); };
exports.max = max;
var min = function (numbers) { return Math.min.apply(Math, __spreadArray(__spreadArray([], numbers, false), [Infinity], false)); };
exports.min = min;
// From point1 to point2, get the x value from y
var lerpX = function (x1, y1, x2, y2) {
    return function (y) {
        if (y1 === y2) {
            return x1;
        }
        var result = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
        return Number.isNaN(result) ? 0 : result;
    };
};
exports.lerpX = lerpX;
// From point1 to point2, get the y value from x
var lerpY = function (x1, y1, x2, y2) {
    return function (x) {
        if (x1 === x2) {
            return y1;
        }
        var result = ((y2 - y1) * (x - x1)) / (x2 - x1) + y1;
        return Number.isNaN(result) ? 0 : result;
    };
};
exports.lerpY = lerpY;
