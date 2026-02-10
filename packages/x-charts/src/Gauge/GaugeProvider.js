"use strict";
// @ignore - do not document.
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugeContext = void 0;
exports.GaugeProvider = GaugeProvider;
exports.useGaugeState = useGaugeState;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var getPercentageValue_1 = require("../internals/getPercentageValue");
var utils_1 = require("./utils");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var angleConversion_1 = require("../internals/angleConversion");
exports.GaugeContext = React.createContext({
    value: null,
    valueMin: 0,
    valueMax: 0,
    startAngle: 0,
    endAngle: 0,
    innerRadius: 0,
    outerRadius: 0,
    cornerRadius: 0,
    cx: 0,
    cy: 0,
    maxRadius: 0,
    valueAngle: null,
});
function GaugeProvider(props) {
    var _a = props.value, value = _a === void 0 ? null : _a, _b = props.valueMin, valueMin = _b === void 0 ? 0 : _b, _c = props.valueMax, valueMax = _c === void 0 ? 100 : _c, _d = props.startAngle, startAngle = _d === void 0 ? 0 : _d, _e = props.endAngle, endAngle = _e === void 0 ? 360 : _e, outerRadiusParam = props.outerRadius, innerRadiusParam = props.innerRadius, cornerRadiusParam = props.cornerRadius, cxParam = props.cx, cyParam = props.cy, children = props.children;
    var _f = (0, useDrawingArea_1.useDrawingArea)(), left = _f.left, top = _f.top, width = _f.width, height = _f.height;
    var ratios = (0, utils_1.getArcRatios)(startAngle, endAngle);
    var innerCx = cxParam ? (0, getPercentageValue_1.getPercentageValue)(cxParam, width) : ratios.cx * width;
    var innerCy = cyParam ? (0, getPercentageValue_1.getPercentageValue)(cyParam, height) : ratios.cy * height;
    var cx = left + innerCx;
    var cy = top + innerCy;
    var maxRadius = (0, utils_1.getAvailableRadius)(innerCx, innerCy, width, height, ratios);
    // If the center is not defined, after computation of the available radius, update the center to use the remaining space.
    if (cxParam === undefined) {
        var usedWidth = maxRadius * (ratios.maxX - ratios.minX);
        cx = left + (width - usedWidth) / 2 + ratios.cx * usedWidth;
    }
    if (cyParam === undefined) {
        var usedHeight = maxRadius * (ratios.maxY - ratios.minY);
        cy = top + (height - usedHeight) / 2 + ratios.cy * usedHeight;
    }
    var outerRadius = (0, getPercentageValue_1.getPercentageValue)(outerRadiusParam !== null && outerRadiusParam !== void 0 ? outerRadiusParam : maxRadius, maxRadius);
    var innerRadius = (0, getPercentageValue_1.getPercentageValue)(innerRadiusParam !== null && innerRadiusParam !== void 0 ? innerRadiusParam : '80%', maxRadius);
    var cornerRadius = (0, getPercentageValue_1.getPercentageValue)(cornerRadiusParam !== null && cornerRadiusParam !== void 0 ? cornerRadiusParam : 0, outerRadius - innerRadius);
    var contextValue = React.useMemo(function () {
        var startAngleRad = (0, angleConversion_1.deg2rad)(startAngle);
        var endAngleRad = (0, angleConversion_1.deg2rad)(endAngle);
        return {
            value: value,
            valueMin: valueMin,
            valueMax: valueMax,
            startAngle: startAngleRad,
            endAngle: endAngleRad,
            outerRadius: outerRadius,
            innerRadius: innerRadius,
            cornerRadius: cornerRadius,
            cx: cx,
            cy: cy,
            maxRadius: maxRadius,
            valueAngle: value === null
                ? null
                : startAngleRad +
                    ((endAngleRad - startAngleRad) * (value - valueMin)) / (valueMax - valueMin),
        };
    }, [
        value,
        valueMin,
        valueMax,
        startAngle,
        endAngle,
        outerRadius,
        innerRadius,
        cornerRadius,
        cx,
        cy,
        maxRadius,
    ]);
    return (0, jsx_runtime_1.jsx)(exports.GaugeContext.Provider, { value: contextValue, children: children });
}
function useGaugeState() {
    return React.useContext(exports.GaugeContext);
}
