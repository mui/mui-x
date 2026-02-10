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
exports.ChartsReferenceLine = ChartsReferenceLine;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var ChartsXReferenceLine_1 = require("./ChartsXReferenceLine");
var ChartsYReferenceLine_1 = require("./ChartsYReferenceLine");
function ChartsReferenceLine(props) {
    var x = props.x, y = props.y;
    if (x !== undefined && y !== undefined) {
        throw new Error('MUI X Charts: The ChartsReferenceLine cannot have both `x` and `y` props set.');
    }
    if (x === undefined && y === undefined) {
        throw new Error('MUI X Charts: The ChartsReferenceLine should have a value in `x` or `y` prop.');
    }
    if (x !== undefined) {
        return (0, jsx_runtime_1.jsx)(ChartsXReferenceLine_1.ChartsXReferenceLine, __assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(ChartsYReferenceLine_1.ChartsYReferenceLine, __assign({}, props));
}
ChartsReferenceLine.propTypes = {
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
     * @default { x: 0, y: 5 } on a horizontal line and { x: 5, y: 0 } on a vertical line.
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
    x: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * The y value associated with the reference line.
     * If defined the reference line will be horizontal.
     */
    y: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string]),
};
