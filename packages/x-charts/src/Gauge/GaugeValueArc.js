"use strict";
'use client';
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
exports.GaugeValueArc = GaugeValueArc;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var useAnimateGaugeValueArc_1 = require("../hooks/animation/useAnimateGaugeValueArc");
var GaugeProvider_1 = require("./GaugeProvider");
var gaugeClasses_1 = require("./gaugeClasses");
var StyledPath = (0, styles_1.styled)('path', {
    name: 'MuiGauge',
    slot: 'ValueArc',
})(function (_a) {
    var theme = _a.theme;
    return ({
        fill: (theme.vars || theme).palette.primary.main,
    });
});
function GaugeValueArc(_a) {
    var className = _a.className, other = __rest(_a, ["className"]);
    var _b = (0, GaugeProvider_1.useGaugeState)(), value = _b.value, valueMin = _b.valueMin, valueMax = _b.valueMax, startAngle = _b.startAngle, endAngle = _b.endAngle, outerRadius = _b.outerRadius, innerRadius = _b.innerRadius, cornerRadius = _b.cornerRadius, cx = _b.cx, cy = _b.cy;
    if (value === null) {
        return null;
    }
    var valueAngle = startAngle + ((value - valueMin) / (valueMax - valueMin)) * (endAngle - startAngle);
    return (<AnimatedGaugeValueArc {...other} className={(0, clsx_1.default)(gaugeClasses_1.gaugeClasses.valueArc, className)} cx={cx} cy={cy} startAngle={startAngle} endAngle={valueAngle} cornerRadius={cornerRadius} innerRadius={innerRadius} outerRadius={outerRadius}/>);
}
GaugeValueArc.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    skipAnimation: prop_types_1.default.bool,
};
function AnimatedGaugeValueArc(_a) {
    var cx = _a.cx, cy = _a.cy, startAngle = _a.startAngle, endAngle = _a.endAngle, cornerRadius = _a.cornerRadius, innerRadius = _a.innerRadius, outerRadius = _a.outerRadius, inSkipAnimation = _a.skipAnimation, other = __rest(_a, ["cx", "cy", "startAngle", "endAngle", "cornerRadius", "innerRadius", "outerRadius", "skipAnimation"]);
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(inSkipAnimation);
    var animatedProps = (0, useAnimateGaugeValueArc_1.useAnimateGaugeValueArc)({
        startAngle: startAngle,
        endAngle: endAngle,
        cornerRadius: cornerRadius,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        skipAnimation: skipAnimation,
    });
    return <StyledPath {...animatedProps} transform={"translate(".concat(cx, ", ").concat(cy, ")")} {...other}/>;
}
AnimatedGaugeValueArc.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    cornerRadius: prop_types_1.default.number.isRequired,
    cx: prop_types_1.default.number.isRequired,
    cy: prop_types_1.default.number.isRequired,
    endAngle: prop_types_1.default.number.isRequired,
    innerRadius: prop_types_1.default.number.isRequired,
    outerRadius: prop_types_1.default.number.isRequired,
    skipAnimation: prop_types_1.default.bool,
    startAngle: prop_types_1.default.number.isRequired,
};
