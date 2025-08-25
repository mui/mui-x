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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartContainerProProps = void 0;
var internals_1 = require("@mui/x-charts/internals");
var allPlugins_1 = require("../internals/plugins/allPlugins");
var useChartContainerProProps = function (props, ref) {
    var _a = props, initialZoom = _a.initialZoom, zoomData = _a.zoomData, onZoomChange = _a.onZoomChange, plugins = _a.plugins, apiRef = _a.apiRef, baseProps = __rest(_a, ["initialZoom", "zoomData", "onZoomChange", "plugins", "apiRef"]);
    var _b = (0, internals_1.useChartContainerProps)(baseProps, ref), chartDataProviderProps = _b.chartDataProviderProps, chartsSurfaceProps = _b.chartsSurfaceProps, children = _b.children;
    var chartDataProviderProProps = __assign(__assign({}, chartDataProviderProps), { initialZoom: initialZoom, zoomData: zoomData, onZoomChange: onZoomChange, apiRef: apiRef, plugins: plugins !== null && plugins !== void 0 ? plugins : allPlugins_1.DEFAULT_PLUGINS });
    return {
        chartDataProviderProProps: chartDataProviderProProps,
        chartsSurfaceProps: chartsSurfaceProps,
        children: children,
    };
};
exports.useChartContainerProProps = useChartContainerProProps;
