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
exports.ContinuousColorLegend = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var useAxis_1 = require("./useAxis");
var ChartsLabel_1 = require("../ChartsLabel/ChartsLabel");
var ChartsLabelGradient_1 = require("../ChartsLabel/ChartsLabelGradient");
var consumeThemeProps_1 = require("../internals/consumeThemeProps");
var continuousColorLegendClasses_1 = require("./continuousColorLegendClasses");
var useChartGradientId_1 = require("../hooks/useChartGradientId");
var templateAreas = function (reverse) {
    var startLabel = reverse ? 'max-label' : 'min-label';
    var endLabel = reverse ? 'min-label' : 'max-label';
    return {
        row: {
            start: "\n    '".concat(startLabel, " . ").concat(endLabel, "'\n    'gradient gradient gradient'\n  "),
            end: "\n      'gradient gradient gradient'\n      '".concat(startLabel, " . ").concat(endLabel, "'\n    "),
            extremes: "\n      '".concat(startLabel, " gradient ").concat(endLabel, "'\n    "),
        },
        column: {
            start: "\n      '".concat(endLabel, " gradient'\n      '. gradient'\n      '").concat(startLabel, " gradient'\n    "),
            end: "\n      'gradient ".concat(endLabel, "'\n      'gradient .'\n      'gradient ").concat(startLabel, "'\n    "),
            extremes: "\n      '".concat(endLabel, "'\n      'gradient'\n      '").concat(startLabel, "'\n    "),
        },
    };
};
var RootElement = (0, styles_1.styled)('ul', {
    name: 'MuiContinuousColorLegend',
    slot: 'Root',
})(function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var theme = _a.theme, ownerState = _a.ownerState;
    return (__assign(__assign({}, theme.typography.caption), (_b = { color: (theme.vars || theme).palette.text.primary, lineHeight: '100%', display: 'grid', flexShrink: 0, gap: theme.spacing(0.5), listStyleType: 'none', paddingInlineStart: 0, marginBlock: theme.spacing(1), marginInline: theme.spacing(1), gridArea: 'legend' }, _b["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.horizontal)] = (_c = {
            gridTemplateRows: 'min-content min-content',
            gridTemplateColumns: 'min-content auto min-content'
        },
        _c["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.start)] = {
            gridTemplateAreas: templateAreas(ownerState.reverse).row.start,
        },
        _c["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.end)] = {
            gridTemplateAreas: templateAreas(ownerState.reverse).row.end,
        },
        _c["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.extremes)] = {
            gridTemplateAreas: templateAreas(ownerState.reverse).row.extremes,
            gridTemplateRows: 'min-content',
            alignItems: 'center',
        },
        _c), _b["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.vertical)] = (_d = {
            gridTemplateRows: 'min-content auto min-content',
            gridTemplateColumns: 'min-content min-content'
        },
        _d["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.start)] = (_e = {
                gridTemplateAreas: templateAreas(ownerState.reverse).column.start
            },
            _e[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.maxLabel, ", .").concat(continuousColorLegendClasses_1.continuousColorLegendClasses.minLabel)] = {
                justifySelf: 'end',
            },
            _e),
        _d["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.end)] = (_f = {
                gridTemplateAreas: templateAreas(ownerState.reverse).column.end
            },
            _f[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.maxLabel, ", .").concat(continuousColorLegendClasses_1.continuousColorLegendClasses.minLabel)] = {
                justifySelf: 'start',
            },
            _f),
        _d["&.".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.extremes)] = (_g = {
                gridTemplateAreas: templateAreas(ownerState.reverse).column.extremes,
                gridTemplateColumns: 'min-content'
            },
            _g[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.maxLabel, ", .").concat(continuousColorLegendClasses_1.continuousColorLegendClasses.minLabel)] = {
                justifySelf: 'center',
            },
            _g),
        _d), _b[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.gradient)] = {
        gridArea: 'gradient',
    }, _b[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.maxLabel)] = {
        gridArea: 'max-label',
    }, _b[".".concat(continuousColorLegendClasses_1.continuousColorLegendClasses.minLabel)] = {
        gridArea: 'min-label',
    }, _b)));
});
var getText = function (label, value, formattedValue) {
    var _a;
    if (typeof label === 'string') {
        return label;
    }
    return (_a = label === null || label === void 0 ? void 0 : label({ value: value, formattedValue: formattedValue })) !== null && _a !== void 0 ? _a : formattedValue;
};
var isZAxis = function (axis) {
    return axis.scale === undefined;
};
var ContinuousColorLegend = (0, consumeThemeProps_1.consumeThemeProps)('MuiContinuousColorLegend', {
    defaultProps: {
        direction: 'horizontal',
        labelPosition: 'end',
        axisDirection: 'z',
    },
    classesResolver: continuousColorLegendClasses_1.useUtilityClasses,
}, function ContinuousColorLegend(props, ref) {
    var _a, _b;
    var minLabel = props.minLabel, maxLabel = props.maxLabel, direction = props.direction, axisDirection = props.axisDirection, axisId = props.axisId, rotateGradient = props.rotateGradient, reverse = props.reverse, classes = props.classes, className = props.className, gradientId = props.gradientId, labelPosition = props.labelPosition, thickness = props.thickness, other = __rest(props, ["minLabel", "maxLabel", "direction", "axisDirection", "axisId", "rotateGradient", "reverse", "classes", "className", "gradientId", "labelPosition", "thickness"]);
    var generateGradientId = (0, useChartGradientId_1.useChartGradientIdObjectBoundBuilder)();
    var axisItem = (0, useAxis_1.useAxis)({ axisDirection: axisDirection, axisId: axisId });
    var colorMap = axisItem === null || axisItem === void 0 ? void 0 : axisItem.colorMap;
    if (!colorMap || !colorMap.type || colorMap.type !== 'continuous') {
        return null;
    }
    var minValue = (_a = colorMap.min) !== null && _a !== void 0 ? _a : 0;
    var maxValue = (_b = colorMap.max) !== null && _b !== void 0 ? _b : 100;
    // Get texts to display
    var valueFormatter = isZAxis(axisItem) ? undefined : axisItem.valueFormatter;
    var formattedMin = valueFormatter
        ? valueFormatter(minValue, { location: 'legend' })
        : minValue.toLocaleString();
    var formattedMax = valueFormatter
        ? valueFormatter(maxValue, { location: 'legend' })
        : maxValue.toLocaleString();
    var minText = getText(minLabel, minValue, formattedMin);
    var maxText = getText(maxLabel, maxValue, formattedMax);
    var minComponent = ((0, jsx_runtime_1.jsx)("li", { className: classes === null || classes === void 0 ? void 0 : classes.minLabel, children: (0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, { className: classes === null || classes === void 0 ? void 0 : classes.label, children: minText }) }));
    var maxComponent = ((0, jsx_runtime_1.jsx)("li", { className: classes === null || classes === void 0 ? void 0 : classes.maxLabel, children: (0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, { className: classes === null || classes === void 0 ? void 0 : classes.label, children: maxText }) }));
    return ((0, jsx_runtime_1.jsxs)(RootElement, __assign({ className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className), ref: ref }, other, { ownerState: props, children: [reverse ? maxComponent : minComponent, (0, jsx_runtime_1.jsx)("li", { className: classes === null || classes === void 0 ? void 0 : classes.gradient, children: (0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { direction: direction, rotate: rotateGradient, reverse: reverse, thickness: thickness, gradientId: gradientId !== null && gradientId !== void 0 ? gradientId : generateGradientId(axisItem.id) }) }), reverse ? minComponent : maxComponent] })));
});
exports.ContinuousColorLegend = ContinuousColorLegend;
ContinuousColorLegend.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The axis direction containing the color configuration to represent.
     * @default 'z'
     */
    axisDirection: prop_types_1.default.oneOf(['x', 'y', 'z']),
    /**
     * The id of the axis item with the color configuration to represent.
     * @default The first axis item.
     */
    axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The direction of the legend layout.
     * @default 'horizontal'
     */
    direction: prop_types_1.default.oneOf(['horizontal', 'vertical']),
    /**
     * The id for the gradient to use.
     * If not provided, it will use the generated gradient from the axis configuration.
     * The `gradientId` will be used as `fill="url(#gradientId)"`.
     * @default auto-generated id
     */
    gradientId: prop_types_1.default.string,
    /**
     * Where to position the labels relative to the gradient.
     * @default 'end'
     */
    labelPosition: prop_types_1.default.oneOf(['start', 'end', 'extremes']),
    /**
     * The label to display at the maximum side of the gradient.
     * Can either be a string, or a function.
     * If not defined, the formatted maximal value is display.
     * @default formattedValue
     */
    maxLabel: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    /**
     * The label to display at the minimum side of the gradient.
     * Can either be a string, or a function.
     * @default formattedValue
     */
    minLabel: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    /**
     * If `true`, the gradient and labels will be reversed.
     * @default false
     */
    reverse: prop_types_1.default.bool,
    /**
     * If provided, the gradient will be rotated by 90deg.
     * Useful for linear gradients that are not in the correct orientation.
     */
    rotateGradient: prop_types_1.default.bool,
    /**
     * The thickness of the gradient
     * @default 12
     */
    thickness: prop_types_1.default.number,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
