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
exports.Gauge = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var clsx_1 = require("clsx");
var GaugeContainer_1 = require("./GaugeContainer");
var GaugeValueArc_1 = require("./GaugeValueArc");
var GaugeReferenceArc_1 = require("./GaugeReferenceArc");
var gaugeClasses_1 = require("./gaugeClasses");
var GaugeValueText_1 = require("./GaugeValueText");
var useUtilityClasses = function (props) {
    var classes = props.classes;
    var slots = { root: ['root'] };
    return (0, composeClasses_1.default)(slots, gaugeClasses_1.getGaugeUtilityClass, classes);
};
var Gauge = React.forwardRef(function Gauge(props, ref) {
    var text = props.text, children = props.children, propsClasses = props.classes, className = props.className, skipAnimation = props.skipAnimation, other = __rest(props, ["text", "children", "classes", "className", "skipAnimation"]);
    var classes = useUtilityClasses(props);
    return ((0, jsx_runtime_1.jsxs)(GaugeContainer_1.GaugeContainer, __assign({}, other, { className: (0, clsx_1.default)(classes.root, className), ref: ref, children: [(0, jsx_runtime_1.jsx)(GaugeReferenceArc_1.GaugeReferenceArc, {}), (0, jsx_runtime_1.jsx)(GaugeValueArc_1.GaugeValueArc, { skipAnimation: skipAnimation }), (0, jsx_runtime_1.jsx)(GaugeValueText_1.GaugeValueText, { text: text }), children] })));
});
exports.Gauge = Gauge;
Gauge.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The radius applied to arc corners (similar to border radius).
     * Set it to '50%' to get rounded arc.
     * @default 0
     */
    cornerRadius: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * The x coordinate of the arc center.
     * Can be a number (in px) or a string with a percentage such as '50%'.
     * The '100%' is the width the drawing area.
     */
    cx: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * The y coordinate of the arc center.
     * Can be a number (in px) or a string with a percentage such as '50%'.
     * The '100%' is the height the drawing area.
     */
    cy: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    desc: prop_types_1.default.string,
    /**
     * The end angle (deg).
     * @default 360
     */
    endAngle: prop_types_1.default.number,
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * The radius between circle center and the beginning of the arc.
     * Can be a number (in px) or a string with a percentage such as '50%'.
     * The '100%' is the maximal radius that fit into the drawing area.
     * @default '80%'
     */
    innerRadius: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * The margin between the SVG and the drawing area.
     * It's used for leaving some space for extra information such as the x- and y-axis or legend.
     *
     * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
     */
    margin: prop_types_1.default.oneOfType([
        prop_types_1.default.number,
        prop_types_1.default.shape({
            bottom: prop_types_1.default.number,
            left: prop_types_1.default.number,
            right: prop_types_1.default.number,
            top: prop_types_1.default.number,
        }),
    ]),
    /**
     * The radius between circle center and the end of the arc.
     * Can be a number (in px) or a string with a percentage such as '50%'.
     * The '100%' is the maximal radius that fit into the drawing area.
     * @default '100%'
     */
    outerRadius: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * If `true`, animations are skipped.
     * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The start angle (deg).
     * @default 0
     */
    startAngle: prop_types_1.default.number,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    text: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    title: prop_types_1.default.string,
    /**
     * The value of the gauge.
     * Set to `null` to not display a value.
     */
    value: prop_types_1.default.number,
    /**
     * The maximal value of the gauge.
     * @default 100
     */
    valueMax: prop_types_1.default.number,
    /**
     * The minimal value of the gauge.
     * @default 0
     */
    valueMin: prop_types_1.default.number,
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
