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
exports.useChartsContainerPremiumProps = useChartsContainerPremiumProps;
var internals_1 = require("@mui/x-charts-pro/internals");
var allPlugins_1 = require("../internals/plugins/allPlugins");
function useChartsContainerPremiumProps(props) {
    var _a = props, initialZoom = _a.initialZoom, zoomData = _a.zoomData, onZoomChange = _a.onZoomChange, zoomInteractionConfig = _a.zoomInteractionConfig, plugins = _a.plugins, apiRef = _a.apiRef, baseProps = __rest(_a, ["initialZoom", "zoomData", "onZoomChange", "zoomInteractionConfig", "plugins", "apiRef"]);
    var _b = (0, internals_1.useChartsContainerProProps)(baseProps), chartsDataProviderProProps = _b.chartsDataProviderProProps, chartsSurfaceProps = _b.chartsSurfaceProps, children = _b.children;
    var chartsDataProviderPremiumProps = __assign(__assign({}, chartsDataProviderProProps), { plugins: plugins !== null && plugins !== void 0 ? plugins : allPlugins_1.DEFAULT_PLUGINS });
    return {
        chartsDataProviderPremiumProps: chartsDataProviderPremiumProps,
        chartsSurfaceProps: chartsSurfaceProps,
        children: children,
    };
}
