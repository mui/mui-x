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
exports.ChartsSvgLayer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var React = require("react");
var clsx_1 = require("clsx");
var ChartsAxesGradients_1 = require("../internals/components/ChartsAxesGradients");
var ChartsProvider_1 = require("../context/ChartsProvider");
var useChartDimensions_selectors_1 = require("../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors");
var chartsSvgLayerClasses_1 = require("./chartsSvgLayerClasses");
var ChartsSvgLayerStyles = (0, styles_1.styled)('svg', {
    name: 'MuiChartsSvgLayer',
    slot: 'Root',
})({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
});
/**
 * A layer that provides the drawing area SVG the chart elements.
 * Must be wrapped in a `<ChartsLayerContainer>`.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsSvgLayer API](https://mui.com/x/api/charts/charts-svg-layer/)
 */
var ChartsSvgLayer = React.forwardRef(function ChartsSvgLayer(inProps, ref) {
    var store = (0, ChartsProvider_1.useChartsContext)().store;
    var svgWidth = store.use(useChartDimensions_selectors_1.selectorChartSvgWidth);
    var svgHeight = store.use(useChartDimensions_selectors_1.selectorChartSvgHeight);
    var themeProps = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsSvgLayer' });
    var children = themeProps.children, className = themeProps.className, other = __rest(themeProps, ["children", "className"]);
    var classes = (0, chartsSvgLayerClasses_1.useUtilityClasses)();
    var hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;
    return ((0, jsx_runtime_1.jsxs)(ChartsSvgLayerStyles, __assign({ viewBox: "0 0 ".concat(svgWidth, " ").concat(svgHeight), className: (0, clsx_1.default)(classes.root, className), "aria-hidden": "true" }, other, { ref: ref, children: [(0, jsx_runtime_1.jsx)(ChartsAxesGradients_1.ChartsAxesGradients, {}), hasIntrinsicSize && children] })));
});
exports.ChartsSvgLayer = ChartsSvgLayer;
ChartsSvgLayer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
