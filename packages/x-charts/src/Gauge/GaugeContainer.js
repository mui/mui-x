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
exports.GaugeContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ChartsSurface_1 = require("../ChartsSurface");
var GaugeProvider_1 = require("./GaugeProvider");
var ChartProvider_1 = require("../context/ChartProvider");
var defaultizeMargin_1 = require("../internals/defaultizeMargin");
var GStyled = (0, styles_1.styled)('g', {
    slot: 'internal',
    shouldForwardProp: undefined,
})(function (_a) {
    var theme = _a.theme;
    return ({
        '& text': {
            fill: (theme.vars || theme).palette.text.primary,
        },
    });
});
var GaugeContainer = React.forwardRef(function GaugeContainer(props, ref) {
    var inWidth = props.width, inHeight = props.height, margin = props.margin, title = props.title, desc = props.desc, value = props.value, _a = props.valueMin, valueMin = _a === void 0 ? 0 : _a, _b = props.valueMax, valueMax = _b === void 0 ? 100 : _b, startAngle = props.startAngle, endAngle = props.endAngle, outerRadius = props.outerRadius, innerRadius = props.innerRadius, cornerRadius = props.cornerRadius, cx = props.cx, cy = props.cy, children = props.children, other = __rest(props, ["width", "height", "margin", "title", "desc", "value", "valueMin", "valueMax", "startAngle", "endAngle", "outerRadius", "innerRadius", "cornerRadius", "cx", "cy", "children"]);
    return ((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: {
            width: inWidth,
            height: inHeight,
            margin: (0, defaultizeMargin_1.defaultizeMargin)(margin, { left: 10, right: 10, top: 10, bottom: 10 }),
        }, 
        // We just use some of the core plugins for dimension management.
        plugins: [], children: (0, jsx_runtime_1.jsx)(GaugeProvider_1.GaugeProvider, { value: value, valueMin: valueMin, valueMax: valueMax, startAngle: startAngle, endAngle: endAngle, outerRadius: outerRadius, innerRadius: innerRadius, cornerRadius: cornerRadius, cx: cx, cy: cy, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, __assign({ title: title, desc: desc, role: "meter", "aria-valuenow": value === null ? undefined : value, "aria-valuemin": valueMin, "aria-valuemax": valueMax }, other, { ref: ref, children: (0, jsx_runtime_1.jsx)(GStyled, { "aria-hidden": "true", children: children }) })) }) }));
});
exports.GaugeContainer = GaugeContainer;
GaugeContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
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
