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
exports.ChartsText = ChartsText;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var getWordsByLines_1 = require("../internals/getWordsByLines");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
/**
 * Helper component to manage multiline text in SVG
 */
function ChartsText(props) {
    var x = props.x, y = props.y, styleProps = props.style, text = props.text, ownerState = props.ownerState, textProps = __rest(props, ["x", "y", "style", "text", "ownerState"]);
    var _a = styleProps !== null && styleProps !== void 0 ? styleProps : {}, angle = _a.angle, textAnchor = _a.textAnchor, dominantBaseline = _a.dominantBaseline, style = __rest(_a, ["angle", "textAnchor", "dominantBaseline"]);
    var isHydrated = (0, useIsHydrated_1.useIsHydrated)();
    var wordsByLines = React.useMemo(function () { return (0, getWordsByLines_1.getWordsByLines)({ style: style, needsComputation: isHydrated && text.includes('\n'), text: text }); }, [style, text, isHydrated]);
    var startDy;
    switch (dominantBaseline) {
        case 'hanging':
        case 'text-before-edge':
            startDy = 0;
            break;
        case 'central':
            startDy = ((wordsByLines.length - 1) / 2) * -wordsByLines[0].height;
            break;
        default:
            startDy = (wordsByLines.length - 1) * -wordsByLines[0].height;
            break;
    }
    return ((0, jsx_runtime_1.jsx)("text", __assign({}, textProps, { transform: angle ? "rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")") : undefined, x: x, y: y, textAnchor: textAnchor, dominantBaseline: dominantBaseline, style: style, children: wordsByLines.map(function (line, index) { return ((0, jsx_runtime_1.jsx)("tspan", { x: x, dy: "".concat(index === 0 ? startDy : wordsByLines[0].height, "px"), dominantBaseline: dominantBaseline, children: line.text }, index)); }) })));
}
ChartsText.propTypes = {
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
    /**
     * Text displayed.
     */
    text: prop_types_1.default.string.isRequired,
};
