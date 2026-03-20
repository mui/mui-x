"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsDataProviderProProps = void 0;
var internals_1 = require("@mui/x-charts/internals");
var useChartsDataProviderProProps = function (props) {
    var _a = (0, internals_1.useChartsDataProviderProps)(props), chartProviderProps = _a.chartProviderProps, localeText = _a.localeText, slots = _a.slots, slotProps = _a.slotProps, children = _a.children;
    return {
        children: children,
        localeText: localeText,
        chartProviderProps: chartProviderProps,
        slots: slots,
        slotProps: slotProps,
    };
};
exports.useChartsDataProviderProProps = useChartsDataProviderProProps;
