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
exports.lineHighlightElementClasses = void 0;
exports.getHighlightElementUtilityClass = getHighlightElementUtilityClass;
exports.LineHighlightElement = LineHighlightElement;
var React = require("react");
var prop_types_1 = require("prop-types");
var reactMajor_1 = require("@mui/x-internals/reactMajor");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getSymbol_1 = require("../internals/getSymbol");
function getHighlightElementUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiHighlightElement', slot);
}
exports.lineHighlightElementClasses = (0, generateUtilityClasses_1.default)('MuiHighlightElement', ['root']);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, id = ownerState.id;
    var slots = {
        root: ['root', "series-".concat(id)],
    };
    return (0, composeClasses_1.default)(slots, getHighlightElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props) {
    var x = props.x, y = props.y, id = props.id, innerClasses = props.classes, color = props.color, shape = props.shape, other = __rest(props, ["x", "y", "id", "classes", "color", "shape"]);
    var classes = useUtilityClasses(props);
    var Element = shape === 'circle' ? 'circle' : 'path';
    var additionalProps = shape === 'circle'
        ? { cx: 0, cy: 0, r: other.r === undefined ? 5 : other.r }
        : {
            d: (0, d3_shape_1.symbol)(d3_shape_1.symbolsFill[(0, getSymbol_1.getSymbol)(shape)])(),
        };
    // React 18 does not recognize `transformOrigin` and React 19 does not recognize `transform-origin`
    var transformOrigin = reactMajor_1.default > 18 ? { transformOrigin: "".concat(x, " ").concat(y) } : { 'transform-origin': "".concat(x, " ").concat(y) };
    return (<Element pointerEvents="none" className={classes.root} transform={"translate(".concat(x, " ").concat(y, ")")} fill={color} {...transformOrigin} {...additionalProps} {...other}/>);
}
LineHighlightElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    shape: prop_types_1.default.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
        .isRequired,
};
