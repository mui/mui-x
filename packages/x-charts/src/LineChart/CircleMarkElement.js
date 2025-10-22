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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleMarkElement = CircleMarkElement;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var animation_1 = require("../internals/animation/animation");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var markElementClasses_1 = require("./markElementClasses");
var Circle = (0, styles_1.styled)('circle')((_a = {},
    _a["&.".concat(markElementClasses_1.markElementClasses.animate)] = {
        transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        transitionProperty: 'cx, cy',
        transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
    },
    _a));
/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
function CircleMarkElement(props) {
    var x = props.x, y = props.y, id = props.id, innerClasses = props.classes, color = props.color, dataIndex = props.dataIndex, onClick = props.onClick, skipAnimation = props.skipAnimation, _a = props.isFaded, isFaded = _a === void 0 ? false : _a, _b = props.isHighlighted, isHighlighted = _b === void 0 ? false : _b, other = __rest(props, ["x", "y", "id", "classes", "color", "dataIndex", "onClick", "skipAnimation", "isFaded", "isHighlighted"]);
    var theme = (0, styles_1.useTheme)();
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
    return (<Circle {...other} cx={x} cy={y} r={5} fill={(theme.vars || theme).palette.background.paper} stroke={color} strokeWidth={2} className={classes.root} onClick={onClick} cursor={onClick ? 'pointer' : 'unset'} {...interactionProps} data-highlighted={isHighlighted || undefined} data-faded={isFaded || undefined}/>);
}
CircleMarkElement.propTypes = {
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
     * The shape of the marker.
     */
    shape: prop_types_1.default.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
        .isRequired,
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation: prop_types_1.default.bool,
};
