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
exports.defaultSlotsMaterial = void 0;
var IconButton_1 = require("@mui/material/IconButton");
var Button_1 = require("@mui/material/Button");
var baseSlots = {
    baseButton: Button_1.default,
    baseIconButton: IconButton_1.default,
};
var iconSlots = {};
exports.defaultSlotsMaterial = __assign(__assign({}, baseSlots), iconSlots);
