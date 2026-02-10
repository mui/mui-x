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
exports.Component = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var BarChart_1 = require("@mui/x-charts/BarChart");
var LineChart_1 = require("@mui/x-charts/LineChart");
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
var PieChart_1 = require("@mui/x-charts/PieChart");
var settings = {
    height: 200,
    series: [{ data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91] }],
    xAxis: [{ position: 'top' }],
    yAxis: [{ data: [1, 2, 3] }],
    margin: { top: 10, bottom: 20 },
};
var scatterSettings = __assign(__assign({}, settings), { series: [
        {
            data: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ],
        },
    ] });
var pieSettings = __assign(__assign({}, settings), { series: [
        {
            data: [{ value: 10 }, { value: 20 }, { value: 30 }],
        },
    ] });
var Component = function () {
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, settings)), (0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, settings)), (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, scatterSettings)), (0, jsx_runtime_1.jsx)(PieChart_1.PieChart, __assign({}, pieSettings))] }));
};
exports.Component = Component;
