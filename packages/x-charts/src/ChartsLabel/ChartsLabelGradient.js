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
exports.ChartsLabelGradient = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var labelGradientClasses_1 = require("./labelGradientClasses");
var consumeThemeProps_1 = require("../internals/consumeThemeProps");
var getRotation = function (direction, reverse, rotate, isRtl) {
    var angle = (direction === 'vertical' ? -90 : 0) + (rotate ? 90 : 0) + (reverse ? 180 : 0);
    if (isRtl && direction !== 'vertical') {
        return angle + 180;
    }
    return angle;
};
var Root = (0, styles_1.styled)('div', {
    name: 'MuiChartsLabelGradient',
    slot: 'Root',
})(function (_a) {
    var _b, _c, _d;
    var ownerState = _a.ownerState;
    var rotation = getRotation(ownerState.direction, ownerState.reverse, ownerState.rotate, ownerState.isRtl);
    return _b = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        _b[".".concat(labelGradientClasses_1.labelGradientClasses.mask)] = {
            borderRadius: 2,
            overflow: 'hidden',
        },
        _b["&.".concat(labelGradientClasses_1.labelGradientClasses.horizontal)] = (_c = {
                width: '100%'
            },
            _c[".".concat(labelGradientClasses_1.labelGradientClasses.mask)] = {
                height: ownerState.thickness,
                width: '100%',
            },
            _c),
        _b["&.".concat(labelGradientClasses_1.labelGradientClasses.vertical)] = (_d = {
                height: '100%'
            },
            _d[".".concat(labelGradientClasses_1.labelGradientClasses.mask)] = {
                width: ownerState.thickness,
                height: '100%',
                '> svg': {
                    height: '100%',
                },
            },
            _d),
        _b.svg = {
            transform: "rotate(".concat(rotation, "deg)"),
            display: 'block',
        },
        _b;
});
/**
 * Generates the label Gradient for the tooltip and legend.
 * @ignore - internal component.
 */
var ChartsLabelGradient = (0, consumeThemeProps_1.consumeThemeProps)('MuiChartsLabelGradient', {
    defaultProps: {
        direction: 'horizontal',
        thickness: 12,
    },
    classesResolver: labelGradientClasses_1.useUtilityClasses,
}, function ChartsLabelGradient(props, ref) {
    var gradientId = props.gradientId, direction = props.direction, classes = props.classes, className = props.className, rotate = props.rotate, reverse = props.reverse, thickness = props.thickness, other = __rest(props, ["gradientId", "direction", "classes", "className", "rotate", "reverse", "thickness"]);
    var isRtl = (0, RtlProvider_1.useRtl)();
    return ((0, jsx_runtime_1.jsx)(Root, __assign({ className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className), ownerState: __assign(__assign({}, props), { isRtl: isRtl }), "aria-hidden": "true", ref: ref }, other, { children: (0, jsx_runtime_1.jsx)("div", { className: classes === null || classes === void 0 ? void 0 : classes.mask, children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("rect", { className: classes === null || classes === void 0 ? void 0 : classes.fill, width: "24", height: "24", fill: "url(#".concat(gradientId, ")") }) }) }) })));
});
exports.ChartsLabelGradient = ChartsLabelGradient;
ChartsLabelGradient.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The direction of the gradient.
     * @default 'horizontal'
     */
    direction: prop_types_1.default.oneOf(['vertical', 'horizontal']),
    /**
     * A unique identifier for the gradient.
     * The `gradientId` will be used as `fill="url(#gradientId)"`.
     */
    gradientId: prop_types_1.default.string.isRequired,
    /**
     * If `true`, the gradient will be reversed.
     */
    reverse: prop_types_1.default.bool,
    /**
     * If provided, the gradient will be rotated by 90deg.
     * Useful for linear gradients that are not in the correct orientation.
     */
    rotate: prop_types_1.default.bool,
    /**
     * The thickness of the gradient
     * @default 12
     */
    thickness: prop_types_1.default.number,
};
