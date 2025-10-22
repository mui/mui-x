"use strict";
'use client';
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
exports.useAxesTooltip = useAxesTooltip;
var useAxisTooltip_1 = require("./useAxisTooltip");
/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
function useAxesTooltip(params) {
    return (0, useAxisTooltip_1.useAxisTooltip)(__assign(__assign({}, params), { multipleAxes: true }));
}
