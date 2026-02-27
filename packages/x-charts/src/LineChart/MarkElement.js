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
exports.MarkElement = MarkElement;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    var theme = _a.theme;
    return (_b = {
            fill: (theme.vars || theme).palette.background.paper
        },
        _b["&.".concat(markElementClasses_1.markElementClasses.animate)] = {
            transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
            transitionProperty: 'transform, transform-origin, opacity',
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
    var x = props.x, y = props.y, seriesId = props.seriesId, innerClasses = props.classes, color = props.color, shape = props.shape, dataIndex = props.dataIndex, onClick = props.onClick, skipAnimation = props.skipAnimation, _a = props.isFaded, isFaded = _a === void 0 ? false : _a, _b = props.isHighlighted, isHighlighted = _b === void 0 ? false : _b, hidden = props.hidden, style = props.style, other = __rest(props, ["x", "y", "seriesId", "classes", "color", "shape", "dataIndex", "onClick", "skipAnimation", "isFaded", "isHighlighted", "hidden", "style"]);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'line', seriesId: seriesId, dataIndex: dataIndex });
    var ownerState = {
        seriesId: seriesId,
        classes: innerClasses,
        isHighlighted: isHighlighted,
        isFaded: isFaded,
        skipAnimation: skipAnimation,
    };
    var classes = (0, markElementClasses_1.useUtilityClasses)(ownerState);
    return ((0, jsx_runtime_1.jsx)(MarkElementPath, __assign({}, other, { style: __assign(__assign({}, style), { transform: "translate(".concat(x, "px, ").concat(y, "px)"), transformOrigin: "".concat(x, "px ").concat(y, "px") }), ownerState: ownerState, className: classes.root, d: (0, d3_shape_1.symbol)(d3_shape_1.symbolsFill[(0, getSymbol_1.getSymbol)(shape)])(), onClick: onClick, cursor: onClick ? 'pointer' : 'unset', pointerEvents: hidden ? 'none' : undefined }, interactionProps, { "data-highlighted": isHighlighted || undefined, "data-faded": isFaded || undefined, opacity: hidden ? 0 : 1, strokeWidth: 2, stroke: color })));
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
    /**
     * If `true`, the marker is hidden.
     * @default false
     */
    hidden: prop_types_1.default.bool,
    seriesId: prop_types_1.default.string.isRequired,
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
