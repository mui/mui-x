"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultizeMargin = defaultizeMargin;
function defaultizeMargin(input, defaultMargin) {
    if (typeof input === 'number') {
        return {
            top: input,
            bottom: input,
            left: input,
            right: input,
        };
    }
    if (defaultMargin) {
        return __assign(__assign({}, defaultMargin), input);
    }
    return input;
}
