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
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var useAnimateBarLabel_1 = require("../../hooks/animation/useAnimateBarLabel");
var barLabelClasses_1 = require("./barLabelClasses");
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
    var _b;
    var _c, _d, _e, _f;
    var theme = _a.theme;
    return (__assign(__assign({}, (_c = theme === null || theme === void 0 ? void 0 : theme.typography) === null || _c === void 0 ? void 0 : _c.body2), (_b = { stroke: 'none', fill: (_f = (_e = (_d = (theme.vars || theme)) === null || _d === void 0 ? void 0 : _d.palette) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.primary, transition: 'opacity 0.2s ease-in, fill 0.2s ease-in', textAnchor: 'middle', dominantBaseline: 'central', pointerEvents: 'none', opacity: 1 }, _b["&.".concat(barLabelClasses_1.barLabelClasses.faded)] = {
        opacity: 0.3,
    }, _b)));
});
function BarLabel(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiBarLabel' });
    var seriesId = props.seriesId, dataIndex = props.dataIndex, color = props.color, isFaded = props.isFaded, isHighlighted = props.isHighlighted, classes = props.classes, skipAnimation = props.skipAnimation, layout = props.layout, xOrigin = props.xOrigin, yOrigin = props.yOrigin, otherProps = __rest(props, ["seriesId", "dataIndex", "color", "isFaded", "isHighlighted", "classes", "skipAnimation", "layout", "xOrigin", "yOrigin"]);
    var animatedProps = (0, useAnimateBarLabel_1.useAnimateBarLabel)(props);
    return <exports.BarLabelComponent {...otherProps} {...animatedProps}/>;
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
    isFaded: prop_types_1.default.bool.isRequired,
    isHighlighted: prop_types_1.default.bool.isRequired,
    layout: prop_types_1.default.oneOf(['horizontal', 'vertical']).isRequired,
    seriesId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
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
