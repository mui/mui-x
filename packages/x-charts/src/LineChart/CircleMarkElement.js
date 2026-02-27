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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleMarkElement = CircleMarkElement;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var animation_1 = require("../internals/animation/animation");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var markElementClasses_1 = require("./markElementClasses");
var Circle = (0, styles_1.styled)('circle', {
    slot: 'internal',
    shouldForwardProp: undefined,
})((_a = {},
    _a["&.".concat(markElementClasses_1.markElementClasses.animate)] = {
        transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        transitionProperty: 'cx, cy, opacity',
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
    var x = props.x, y = props.y, seriesId = props.seriesId, innerClasses = props.classes, color = props.color, dataIndex = props.dataIndex, onClick = props.onClick, skipAnimation = props.skipAnimation, _a = props.isFaded, isFaded = _a === void 0 ? false : _a, _b = props.isHighlighted, isHighlighted = _b === void 0 ? false : _b, 
    // @ts-expect-error, prevents it from being passed to the svg element
    shape = props.shape, hidden = props.hidden, other = __rest(props, ["x", "y", "seriesId", "classes", "color", "dataIndex", "onClick", "skipAnimation", "isFaded", "isHighlighted", "shape", "hidden"]);
    var theme = (0, styles_1.useTheme)();
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'line', seriesId: seriesId, dataIndex: dataIndex });
    var ownerState = {
        seriesId: seriesId,
        classes: innerClasses,
        isHighlighted: isHighlighted,
        isFaded: isFaded,
        skipAnimation: skipAnimation,
    };
    var classes = (0, markElementClasses_1.useUtilityClasses)(ownerState);
    return ((0, jsx_runtime_1.jsx)(Circle, __assign({}, other, { cx: x, cy: y, r: 5, fill: (theme.vars || theme).palette.background.paper, stroke: color, strokeWidth: 2, className: classes.root, onClick: onClick, cursor: onClick ? 'pointer' : 'unset', pointerEvents: hidden ? 'none' : undefined }, interactionProps, { "data-highlighted": isHighlighted || undefined, "data-faded": isFaded || undefined, opacity: hidden ? 0 : 1 })));
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
    seriesId: prop_types_1.default.string.isRequired,
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
