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
exports.AnimatedLine = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var hooks_1 = require("../hooks");
var AppearingMask_1 = require("./AppearingMask");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [AnimatedLine API](https://mui.com/x/api/charts/animated-line/)
 */
var AnimatedLine = React.forwardRef(function AnimatedLine(props, ref) {
    var skipAnimation = props.skipAnimation, ownerState = props.ownerState, other = __rest(props, ["skipAnimation", "ownerState"]);
    var animateProps = (0, hooks_1.useAnimateLine)(__assign(__assign({}, props), { ref: ref }));
    return (<AppearingMask_1.AppearingMask skipAnimation={skipAnimation} id={"".concat(ownerState.id, "-line-clip")}>
        <path stroke={ownerState.gradientId ? "url(#".concat(ownerState.gradientId, ")") : ownerState.color} strokeWidth={2} strokeLinejoin="round" fill="none" filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined} opacity={ownerState.isFaded ? 0.3 : 1} data-series={ownerState.id} data-highlighted={ownerState.isHighlighted || undefined} data-faded={ownerState.isFaded || undefined} {...other} {...animateProps}/>
      </AppearingMask_1.AppearingMask>);
});
exports.AnimatedLine = AnimatedLine;
AnimatedLine.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    d: prop_types_1.default.string.isRequired,
    ownerState: prop_types_1.default.shape({
        classes: prop_types_1.default.object,
        color: prop_types_1.default.string.isRequired,
        gradientId: prop_types_1.default.string,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        isFaded: prop_types_1.default.bool.isRequired,
        isHighlighted: prop_types_1.default.bool.isRequired,
    }).isRequired,
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation: prop_types_1.default.bool,
};
