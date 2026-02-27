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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXReferenceLineClasses = getXReferenceLineClasses;
exports.ChartsXReferenceLine = ChartsXReferenceLine;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var warning_1 = require("@mui/x-internals/warning");
var hooks_1 = require("../hooks");
var common_1 = require("./common");
var ChartsText_1 = require("../ChartsText");
var chartsReferenceLineClasses_1 = require("./chartsReferenceLineClasses");
var getTextParams = function (_a) {
    var _b, _c;
    var top = _a.top, height = _a.height, spacing = _a.spacing, position = _a.position, _d = _a.labelAlign, labelAlign = _d === void 0 ? 'middle' : _d;
    var defaultSpacingOtherAxis = labelAlign === 'middle' ? common_1.DEFAULT_SPACING_MIDDLE_OTHER_AXIS : common_1.DEFAULT_SPACING;
    var spacingX = (_b = (typeof spacing === 'object' ? spacing.x : spacing)) !== null && _b !== void 0 ? _b : common_1.DEFAULT_SPACING;
    var spacingY = (_c = (typeof spacing === 'object' ? spacing.y : defaultSpacingOtherAxis)) !== null && _c !== void 0 ? _c : defaultSpacingOtherAxis;
    switch (labelAlign) {
        case 'start':
            return {
                x: position + spacingX,
                y: top + spacingY,
                style: {
                    dominantBaseline: 'hanging',
                    textAnchor: 'start',
                },
            };
        case 'end':
            return {
                x: position + spacingX,
                y: top + height - spacingY,
                style: {
                    dominantBaseline: 'auto',
                    textAnchor: 'start',
                },
            };
        default:
            return {
                x: position + spacingX,
                y: top + height / 2 + spacingY,
                style: {
                    dominantBaseline: 'central',
                    textAnchor: 'start',
                },
            };
    }
};
function getXReferenceLineClasses(classes) {
    return (0, composeClasses_1.default)({
        root: ['root', 'vertical'],
        line: ['line'],
        label: ['label'],
    }, chartsReferenceLineClasses_1.getReferenceLineUtilityClass, classes);
}
function ChartsXReferenceLine(props) {
    var x = props.x, _a = props.label, label = _a === void 0 ? '' : _a, spacing = props.spacing, inClasses = props.classes, _b = props.labelAlign, labelAlign = _b === void 0 ? 'middle' : _b, lineStyle = props.lineStyle, labelStyle = props.labelStyle, axisId = props.axisId;
    var _c = (0, hooks_1.useDrawingArea)(), top = _c.top, height = _c.height;
    var xAxisScale = (0, hooks_1.useXScale)(axisId);
    var xPosition = xAxisScale(x);
    if (xPosition === undefined) {
        if (process.env.NODE_ENV !== 'production') {
            (0, warning_1.warnOnce)("MUI X Charts: the value ".concat(x, " does not exist in the data of x axis with id ").concat(axisId, "."), 'error');
        }
        return null;
    }
    var d = "M ".concat(xPosition, " ").concat(top, " l 0 ").concat(height);
    var classes = getXReferenceLineClasses(inClasses);
    var textParams = __assign(__assign({ text: label, fontSize: 12 }, getTextParams({
        top: top,
        height: height,
        spacing: spacing,
        position: xPosition,
        labelAlign: labelAlign,
    })), { className: classes.label });
    return ((0, jsx_runtime_1.jsxs)(common_1.ReferenceLineRoot, { className: classes.root, children: [(0, jsx_runtime_1.jsx)("path", { d: d, className: classes.line, style: lineStyle }), (0, jsx_runtime_1.jsx)(ChartsText_1.ChartsText, __assign({}, textParams, { style: __assign(__assign({}, textParams.style), labelStyle) }))] }));
}
ChartsXReferenceLine.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The id of the axis used for the reference value.
     * @default The `id` of the first defined axis.
     */
    axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The label to display along the reference line.
     */
    label: prop_types_1.default.string,
    /**
     * The alignment if the label is in the chart drawing area.
     * @default 'middle'
     */
    labelAlign: prop_types_1.default.oneOf(['end', 'middle', 'start']),
    /**
     * The style applied to the label.
     */
    labelStyle: prop_types_1.default.object,
    /**
     * The style applied to the line.
     */
    lineStyle: prop_types_1.default.object,
    /**
     * Additional space around the label in px.
     * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
     * @default 5
     */
    spacing: prop_types_1.default.oneOfType([
        prop_types_1.default.number,
        prop_types_1.default.shape({
            x: prop_types_1.default.number,
            y: prop_types_1.default.number,
        }),
    ]),
    /**
     * The x value associated with the reference line.
     * If defined the reference line will be vertical.
     */
    x: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
        .isRequired,
};
