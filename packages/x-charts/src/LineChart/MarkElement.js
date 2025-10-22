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
exports.MarkElement = MarkElement;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var animation_1 = require("../internals/animation/animation");
var getSymbol_1 = require("../internals/getSymbol");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var markElementClasses_1 = require("./markElementClasses");
var MarkElementPath = (0, styles_1.styled)('path', {
    name: 'MuiMarkElement',
    slot: 'Root',
})(function (_a) {
    var _b;
    var ownerState = _a.ownerState, theme = _a.theme;
    return (_b = {
            fill: (theme.vars || theme).palette.background.paper,
            stroke: ownerState.color,
            strokeWidth: 2
        },
        _b["&.".concat(markElementClasses_1.markElementClasses.animate)] = {
            transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
            transitionProperty: 'transform, transform-origin',
            transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
        },
        _b);
});
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
function MarkElement(props) {
    var x = props.x, y = props.y, id = props.id, innerClasses = props.classes, color = props.color, shape = props.shape, dataIndex = props.dataIndex, onClick = props.onClick, skipAnimation = props.skipAnimation, _a = props.isFaded, isFaded = _a === void 0 ? false : _a, _b = props.isHighlighted, isHighlighted = _b === void 0 ? false : _b, other = __rest(props, ["x", "y", "id", "classes", "color", "shape", "dataIndex", "onClick", "skipAnimation", "isFaded", "isHighlighted"]);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'line', seriesId: id, dataIndex: dataIndex });
    var ownerState = {
        id: id,
        classes: innerClasses,
        isHighlighted: isHighlighted,
        isFaded: isFaded,
        color: color,
        skipAnimation: skipAnimation,
    };
    var classes = (0, markElementClasses_1.useUtilityClasses)(ownerState);
    return (<MarkElementPath {...other} style={{
            transform: "translate(".concat(x, "px, ").concat(y, "px)"),
            transformOrigin: "".concat(x, "px ").concat(y, "px"),
        }} ownerState={ownerState} className={classes.root} d={(0, d3_shape_1.symbol)(d3_shape_1.symbolsFill[(0, getSymbol_1.getSymbol)(shape)])()} onClick={onClick} cursor={onClick ? 'pointer' : 'unset'} {...interactionProps} data-highlighted={isHighlighted || undefined} data-faded={isFaded || undefined}/>);
}
MarkElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: prop_types_1.default.number.isRequired,
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * If `true`, the marker is faded.
     * @default false
     */
    isFaded: prop_types_1.default.bool,
    /**
     * If `true`, the marker is highlighted.
     * @default false
     */
    isHighlighted: prop_types_1.default.bool,
    /**
     * The shape of the marker.
     */
    shape: prop_types_1.default.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
        .isRequired,
    /**
     * If `true`, animations are skipped.
     */
    skipAnimation: prop_types_1.default.bool,
};
