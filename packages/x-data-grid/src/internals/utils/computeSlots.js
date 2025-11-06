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
exports.computeSlots = computeSlots;
function computeSlots(_a) {
    var defaultSlots = _a.defaultSlots, slots = _a.slots;
    var overrides = slots;
    if (!overrides || Object.keys(overrides).length === 0) {
        return defaultSlots;
    }
    var result = __assign({}, defaultSlots);
    Object.keys(overrides).forEach(function (key) {
        var k = key;
        if (overrides[k] !== undefined) {
            result[k] = overrides[k];
        }
    });
    return result;
}
