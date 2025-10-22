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
exports.AnimatedArea = AnimatedArea;
var React = require("react");
var prop_types_1 = require("prop-types");
var useAnimateArea_1 = require("../hooks/animation/useAnimateArea");
var AppearingMask_1 = require("./AppearingMask");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
function AnimatedArea(props) {
    var skipAnimation = props.skipAnimation, ownerState = props.ownerState, other = __rest(props, ["skipAnimation", "ownerState"]);
    var animatedProps = (0, useAnimateArea_1.useAnimateArea)(props);
    return (<AppearingMask_1.AppearingMask skipAnimation={skipAnimation} id={"".concat(ownerState.id, "-area-clip")}>
      <path fill={ownerState.gradientId ? "url(#".concat(ownerState.gradientId, ")") : ownerState.color} filter={
        // eslint-disable-next-line no-nested-ternary
        ownerState.isHighlighted
            ? 'brightness(140%)'
            : ownerState.gradientId
                ? undefined
                : 'brightness(120%)'} opacity={ownerState.isFaded ? 0.3 : 1} stroke="none" data-series={ownerState.id} data-highlighted={ownerState.isHighlighted || undefined} data-faded={ownerState.isFaded || undefined} {...other} {...animatedProps}/>
    </AppearingMask_1.AppearingMask>);
}
AnimatedArea.propTypes = {
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
