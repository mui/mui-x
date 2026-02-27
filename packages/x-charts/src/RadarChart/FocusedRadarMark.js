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
exports.FocusedRadarMark = FocusedRadarMark;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var useRadarSeriesData_1 = require("./RadarSeriesPlot/useRadarSeriesData");
function FocusedRadarMark(props) {
    var _a;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var seriesCoordinates = (0, useRadarSeriesData_1.useRadarSeriesData)(focusedItem === null || focusedItem === void 0 ? void 0 : focusedItem.seriesId);
    if (!focusedItem || focusedItem.type !== 'radar' || seriesCoordinates.length === 0) {
        return null;
    }
    var point = seriesCoordinates[0].points[focusedItem.dataIndex];
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ fill: "none", stroke: ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette.text.primary, strokeWidth: 2, x: point.x - 6, y: point.y - 6, width: 2 * 6, height: 2 * 6, rx: 3, ry: 3 }, props)));
}
