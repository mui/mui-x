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
var React = require("react");
var BarChartPro_1 = require("@mui/x-charts-pro/BarChartPro");
var LineChartPro_1 = require("@mui/x-charts-pro/LineChartPro");
var ScatterChartPro_1 = require("@mui/x-charts-pro/ScatterChartPro");
var Heatmap_1 = require("@mui/x-charts-pro/Heatmap");
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
var heatmapSettings = __assign(__assign({}, settings), { series: [
        {
            data: [
                [0, 0, 10],
                [0, 1, 20],
                [0, 2, 40],
            ],
        },
    ] });
var Component = function () {
    return (<React.Fragment>
      <BarChartPro_1.BarChartPro {...settings}/>
      <LineChartPro_1.LineChartPro {...settings}/>
      <ScatterChartPro_1.ScatterChartPro {...scatterSettings}/>
      <Heatmap_1.Heatmap {...heatmapSettings}/>
    </React.Fragment>);
};
exports.Component = Component;
