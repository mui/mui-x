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
exports.getYReferenceLineClasses = getYReferenceLineClasses;
exports.ChartsYReferenceLine = ChartsYReferenceLine;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var warning_1 = require("@mui/x-internals/warning");
var hooks_1 = require("../hooks");
var common_1 = require("./common");
var ChartsText_1 = require("../ChartsText");
var chartsReferenceLineClasses_1 = require("./chartsReferenceLineClasses");
var getTextParams = function (_a) {
    var left = _a.left, width = _a.width, spacingX = _a.spacingX, _b = _a.labelAlign, labelAlign = _b === void 0 ? 'middle' : _b;
    switch (labelAlign) {
        case 'start':
            return {
                x: left + spacingX,
                style: {
                    dominantBaseline: 'auto',
                    textAnchor: 'start',
                },
            };
        case 'end':
            return {
                x: left + width - spacingX,
                style: {
                    dominantBaseline: 'auto',
                    textAnchor: 'end',
                },
            };
        default:
            return {
                x: left + width / 2,
                style: {
                    dominantBaseline: 'auto',
                    textAnchor: 'middle',
                },
            };
    }
};
function getYReferenceLineClasses(classes) {
    return (0, composeClasses_1.default)({
        root: ['root', 'horizontal'],
        line: ['line'],
        label: ['label'],
    }, chartsReferenceLineClasses_1.getReferenceLineUtilityClass, classes);
}
function ChartsYReferenceLine(props) {
    var _a, _b;
    var y = props.y, _c = props.label, label = _c === void 0 ? '' : _c, _d = props.spacing, spacing = _d === void 0 ? 5 : _d, inClasses = props.classes, labelAlign = props.labelAlign, lineStyle = props.lineStyle, labelStyle = props.labelStyle, axisId = props.axisId;
    var _e = (0, hooks_1.useDrawingArea)(), left = _e.left, width = _e.width;
    var yAxisScale = (0, hooks_1.useYScale)(axisId);
    var yPosition = yAxisScale(y);
    if (yPosition === undefined) {
        if (process.env.NODE_ENV !== 'production') {
            (0, warning_1.warnOnce)("MUI X Charts: the value ".concat(y, " does not exist in the data of y axis with id ").concat(axisId, "."), 'error');
        }
        return null;
    }
    var d = "M ".concat(left, " ").concat(yPosition, " l ").concat(width, " 0");
    var classes = getYReferenceLineClasses(inClasses);
    var spacingX = typeof spacing === 'object' ? ((_a = spacing.x) !== null && _a !== void 0 ? _a : 0) : spacing;
    var spacingY = typeof spacing === 'object' ? ((_b = spacing.y) !== null && _b !== void 0 ? _b : 0) : spacing;
    var textParams = __assign(__assign({ y: yPosition - spacingY, text: label, fontSize: 12 }, getTextParams({
        left: left,
        width: width,
        spacingX: spacingX,
        labelAlign: labelAlign,
    })), { className: classes.label });
    return (<common_1.ReferenceLineRoot className={classes.root}>
      <path d={d} className={classes.line} style={lineStyle}/>
      <ChartsText_1.ChartsText {...textParams} style={__assign(__assign({}, textParams.style), labelStyle)}/>
    </common_1.ReferenceLineRoot>);
}
ChartsYReferenceLine.propTypes = {
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
     * The y value associated with the reference line.
     * If defined the reference line will be horizontal.
     */
    y: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
        .isRequired,
};
