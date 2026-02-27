"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarAxis = RadarAxis;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var useRadarAxis_1 = require("./useRadarAxis");
var RadarAxis_utils_1 = require("./RadarAxis.utils");
var radarAxisClasses_1 = require("./radarAxisClasses");
function RadarAxis(props) {
    var _a;
    var _b = props.labelOrientation, labelOrientation = _b === void 0 ? 'horizontal' : _b, textAnchor = props.textAnchor, dominantBaseline = props.dominantBaseline;
    var classes = (0, radarAxisClasses_1.useUtilityClasses)(props.classes);
    var theme = (0, styles_1.useTheme)();
    var data = (0, useRadarAxis_1.useRadarAxis)(props);
    if (data === null) {
        return null;
    }
    var center = data.center, angle = data.angle, labels = data.labels;
    return ((0, jsx_runtime_1.jsxs)("g", { className: classes.root, children: [(0, jsx_runtime_1.jsx)("path", { d: "M ".concat(center.x, " ").concat(center.y, " L ").concat(labels[labels.length - 1].x, " ").concat(labels[labels.length - 1].y), stroke: ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette.text.primary, strokeOpacity: 0.3, className: classes.line }), labels.map(function (_a) {
                var _b;
                var x = _a.x, y = _a.y, formattedValue = _a.formattedValue;
                return ((0, jsx_runtime_1.jsx)("text", __assign({ fontSize: 12, fill: ((_b = theme.vars) !== null && _b !== void 0 ? _b : theme).palette.text.primary, stroke: "none", className: classes.label }, (0, RadarAxis_utils_1.getLabelAttributes)({ labelOrientation: labelOrientation, x: x, y: y, angle: angle, textAnchor: textAnchor, dominantBaseline: dominantBaseline }), { children: formattedValue }), formattedValue));
            })] }));
}
RadarAxis.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The absolute rotation angle of the metrics (in degree)
     * If not defined the metric angle will be used.
     */
    angle: prop_types_1.default.number,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The number of divisions with label.
     * @default 1
     */
    divisions: prop_types_1.default.number,
    /**
     * The labels dominant baseline or a function returning the dominant baseline for a given axis angle (in degree).
     */
    dominantBaseline: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf([
            'alphabetic',
            'auto',
            'central',
            'hanging',
            'ideographic',
            'inherit',
            'mathematical',
            'middle',
            'no-change',
            'reset-size',
            'text-after-edge',
            'text-before-edge',
            'use-script',
        ]),
        prop_types_1.default.func,
    ]),
    /**
     * Defines how label align with the axis.
     * - 'horizontal': labels stay horizontal and their placement change with the axis angle.
     * - 'rotated': labels are rotated 90deg relatively to their axis.
     * @default 'horizontal'
     */
    labelOrientation: prop_types_1.default.oneOf(['horizontal', 'rotated']),
    /**
     * The metric to get.
     * If `undefined`, the hook returns `null`
     */
    metric: prop_types_1.default.string,
    /**
     * The labels text anchor or a function returning the text anchor for a given axis angle (in degree).
     */
    textAnchor: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf(['end', 'inherit', 'middle', 'start']),
        prop_types_1.default.func,
    ]),
};
