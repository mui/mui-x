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
exports.useBarChartPremiumProps = useBarChartPremiumProps;
var internals_1 = require("@mui/x-charts/internals");
/**
 * A helper function that extracts BarChartPremiumProps from the input props
 * and returns an object with props for the children components of BarChartPremium.
 *
 * @param props The input props for BarChartPremium
 * @returns An object with props for the children components of BarChartPremium
 */
function useBarChartPremiumProps(props) {
    var _a = (0, internals_1.useBarChartProps)(props), chartsContainerProps = _a.chartsContainerProps, barChartProps = __rest(_a, ["chartsContainerProps"]);
    var rangeBarPlotProps = {
        onItemClick: props.onItemClick,
        slots: props.slots,
        slotProps: props.slotProps,
        borderRadius: props.borderRadius,
    };
    return __assign(__assign({}, barChartProps), { chartsContainerProps: chartsContainerProps, rangeBarPlotProps: rangeBarPlotProps });
}
