"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartDataProviderProProps = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartDataProviderProProps = function (props) {
    var _a = (0, internals_1.useChartDataProviderProps)(props), chartProviderProps = _a.chartProviderProps, localeText = _a.localeText, slots = _a.slots, slotProps = _a.slotProps, children = _a.children;
    return {
        children: children,
        localeText: localeText,
        chartProviderProps: chartProviderProps,
        slots: slots,
        slotProps: slotProps,
    };
};
exports.useChartDataProviderProProps = useChartDataProviderProProps;
