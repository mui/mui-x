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
exports.getWordsByLines = getWordsByLines;
var domUtils_1 = require("./domUtils");
function getWordsByLines(_a) {
    var style = _a.style, needsComputation = _a.needsComputation, text = _a.text;
    return text.split('\n').map(function (subText) { return (__assign({ text: subText }, (needsComputation ? (0, domUtils_1.getStringSize)(subText, style) : { width: 0, height: 0 }))); });
}
