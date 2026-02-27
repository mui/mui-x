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
exports.BarLabelComponent = void 0;
exports.BarLabel = BarLabel;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var useAnimateBarLabel_1 = require("../../hooks/animation/useAnimateBarLabel");
var barLabelClasses_1 = require("./barLabelClasses");
var animation_1 = require("../../internals/animation/animation");
exports.BarLabelComponent = (0, styles_1.styled)('text', {
    name: 'MuiBarLabel',
    slot: 'Root',
    overridesResolver: function (_, styles) {
        var _a, _b;
        return [
            (_a = {}, _a["&.".concat(barLabelClasses_1.barLabelClasses.faded)] = styles.faded, _a),
            (_b = {}, _b["&.".concat(barLabelClasses_1.barLabelClasses.highlighted)] = styles.highlighted, _b),
            styles.root,
        ];
    },
})(function (_a) {
    var _b, _c, _d, _e;
    var theme = _a.theme;
    return (__assign(__assign({}, (_b = theme === null || theme === void 0 ? void 0 : theme.typography) === null || _b === void 0 ? void 0 : _b.body2), { stroke: 'none', fill: (_e = (_d = (_c = (theme.vars || theme)) === null || _c === void 0 ? void 0 : _c.palette) === null || _d === void 0 ? void 0 : _d.text) === null || _e === void 0 ? void 0 : _e.primary, transitionProperty: 'opacity, fill', transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"), transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION, pointerEvents: 'none' }));
});
function BarLabel(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiBarLabel' });
    var seriesId = props.seriesId, dataIndex = props.dataIndex, color = props.color, isFaded = props.isFaded, isHighlighted = props.isHighlighted, classes = props.classes, skipAnimation = props.skipAnimation, layout = props.layout, xOrigin = props.xOrigin, yOrigin = props.yOrigin, placement = props.placement, hidden = props.hidden, otherProps = __rest(props, ["seriesId", "dataIndex", "color", "isFaded", "isHighlighted", "classes", "skipAnimation", "layout", "xOrigin", "yOrigin", "placement", "hidden"]);
    var animatedProps = (0, useAnimateBarLabel_1.useAnimateBarLabel)(props);
    var textAnchor = getTextAnchor(props);
    var dominantBaseline = getDominantBaseline(props);
    var fadedOpacity = isFaded ? 0.3 : 1;
    return ((0, jsx_runtime_1.jsx)(exports.BarLabelComponent, __assign({ textAnchor: textAnchor, dominantBaseline: dominantBaseline, opacity: hidden ? 0 : fadedOpacity }, otherProps, animatedProps)));
}
function getTextAnchor(_a) {
    var placement = _a.placement, layout = _a.layout, xOrigin = _a.xOrigin, x = _a.x;
    if (placement === 'outside') {
        if (layout === 'horizontal') {
            return x < xOrigin ? 'end' : 'start';
        }
        return 'middle';
    }
    return 'middle';
}
function getDominantBaseline(_a) {
    var placement = _a.placement, layout = _a.layout, yOrigin = _a.yOrigin, y = _a.y;
    if (placement === 'outside') {
        if (layout === 'horizontal') {
            return 'central';
        }
        return y < yOrigin ? 'auto' : 'hanging';
    }
    return 'central';
}
BarLabel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    dataIndex: prop_types_1.default.number.isRequired,
    /**
     * Height of the bar this label belongs to.
     */
    height: prop_types_1.default.number.isRequired,
    /**
     * If true, the bar label is hidden.
     */
    hidden: prop_types_1.default.bool,
    isFaded: prop_types_1.default.bool.isRequired,
    isHighlighted: prop_types_1.default.bool.isRequired,
    layout: prop_types_1.default.oneOf(['horizontal', 'vertical']).isRequired,
    /**
     * The placement of the bar label.
     * It controls whether the label is rendered in the center or outside the bar.
     * @default 'center'
     */
    placement: prop_types_1.default.oneOf(['center', 'outside']),
    seriesId: prop_types_1.default.string.isRequired,
    skipAnimation: prop_types_1.default.bool.isRequired,
    /**
     * Width of the bar this label belongs to.
     */
    width: prop_types_1.default.number.isRequired,
    /**
     * Position in the x-axis of the bar this label belongs to.
     */
    x: prop_types_1.default.number.isRequired,
    /**
     * The x-coordinate of the stack this bar label belongs to.
     */
    xOrigin: prop_types_1.default.number.isRequired,
    /**
     * Position in the y-axis of the bar this label belongs to.
     */
    y: prop_types_1.default.number.isRequired,
    /**
     * The y-coordinate of the stack this bar label belongs to.
     */
    yOrigin: prop_types_1.default.number.isRequired,
};
