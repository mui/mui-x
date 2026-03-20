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
exports.ChartsLoadingOverlay = ChartsLoadingOverlay;
var jsx_runtime_1 = require("react/jsx-runtime");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var useChartsLocalization_1 = require("../hooks/useChartsLocalization");
var common_1 = require("./common");
function ChartsLoadingOverlay(props) {
    var _a = (0, useDrawingArea_1.useDrawingArea)(), top = _a.top, left = _a.left, height = _a.height, width = _a.width;
    var localeText = (0, useChartsLocalization_1.useChartsLocalization)().localeText;
    return ((0, jsx_runtime_1.jsx)(common_1.StyledText, __assign({ x: left + width / 2, y: top + height / 2 }, props, { children: localeText.loading })));
}
