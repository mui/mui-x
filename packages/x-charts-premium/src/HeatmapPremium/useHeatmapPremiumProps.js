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
exports.useHeatmapPremiumProps = useHeatmapPremiumProps;
var internals_1 = require("@mui/x-charts-pro/internals");
function useHeatmapPremiumProps(props) {
    var _a;
    var _b = (0, internals_1.useHeatmapProps)(props), chartsDataProviderProProps = _b.chartsDataProviderProProps, heatmapPlotProps = _b.heatmapPlotProps, other = __rest(_b, ["chartsDataProviderProProps", "heatmapPlotProps"]);
    var heatmapPlotPremiumProps = __assign(__assign({}, heatmapPlotProps), { renderer: (_a = props.renderer) !== null && _a !== void 0 ? _a : 'svg-single' });
    return __assign(__assign({}, other), { heatmapPlotPremiumProps: heatmapPlotPremiumProps, chartsDataProviderPremiumProps: chartsDataProviderProProps });
}
