"use strict";
'use client';
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
exports.GaugeValueText = GaugeValueText;
var React = require("react");
var prop_types_1 = require("prop-types");
var GaugeProvider_1 = require("./GaugeProvider");
var ChartsText_1 = require("../ChartsText");
function defaultFormatter(_a) {
    var value = _a.value;
    return value === null ? null : value.toLocaleString();
}
function GaugeValueText(props) {
    var _a = props.text, text = _a === void 0 ? defaultFormatter : _a, className = props.className, other = __rest(props, ["text", "className"]);
    var _b = (0, GaugeProvider_1.useGaugeState)(), value = _b.value, valueMin = _b.valueMin, valueMax = _b.valueMax, cx = _b.cx, cy = _b.cy;
    var formattedText = typeof text === 'function' ? text({ value: value, valueMin: valueMin, valueMax: valueMax }) : text;
    if (formattedText === null) {
        return null;
    }
    return (<g className={className}>
      <ChartsText_1.ChartsText x={cx} y={cy} text={formattedText} style={{ textAnchor: 'middle', dominantBaseline: 'central' }} {...other}/>
    </g>);
}
GaugeValueText.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Height of a text line (in `em`).
     */
    lineHeight: prop_types_1.default.number,
    /**
     * If `true`, the line width is computed.
     * @default false
     */
    needsComputation: prop_types_1.default.bool,
    ownerState: prop_types_1.default.any,
    /**
     * Style applied to text elements.
     */
    style: prop_types_1.default.object,
    text: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
};
