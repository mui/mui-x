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
var icons_1 = require("./icons");
var iconSlots = {
    columnMenuPinRightIcon: icons_1.GridPushPinRightIcon,
    columnMenuPinLeftIcon: icons_1.GridPushPinLeftIcon,
};
var materialSlots = __assign({}, iconSlots);
exports.default = materialSlots;
