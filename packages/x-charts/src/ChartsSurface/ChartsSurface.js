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
exports.ChartsSurface = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var React = require("react");
var chartsSurfaceClasses_1 = require("./chartsSurfaceClasses");
var ChartsSvgLayer_1 = require("../ChartsSvgLayer");
// eslint-disable-next-line import/no-cycle
var ChartsLayerContainer_1 = require("../ChartsLayerContainer");
/**
 * A helper component that combines `<ChartsLayerContainer>` and `<ChartsSvgLayer>` to provide a surface for drawing charts.
 * If you need more control over the layers, you can use `<ChartsLayerContainer>` and `<ChartsSvgLayer>` separately.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsSurface API](https://mui.com/x/api/charts/charts-surface/)
 */
var ChartsSurface = React.forwardRef(function ChartsSurface(inProps, ref) {
    var themeProps = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsSurface' });
    var children = themeProps.children, className = themeProps.className, title = themeProps.title, desc = themeProps.desc, other = __rest(themeProps, ["children", "className", "title", "desc"]);
    var classes = (0, chartsSurfaceClasses_1.useUtilityClasses)();
    return ((0, jsx_runtime_1.jsx)(ChartsLayerContainer_1.ChartsLayerContainer, { className: (0, clsx_1.default)(classes.root, className), ref: ref, title: title, desc: desc, children: (0, jsx_runtime_1.jsx)(ChartsSvgLayer_1.ChartsSvgLayer, __assign({}, other, { children: children })) }));
});
exports.ChartsSurface = ChartsSurface;
ChartsSurface.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    /**
     * The description of the chart.
     * Used to provide an accessible description for the chart.
     */
    desc: prop_types_1.default.string,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * The title of the chart.
     * Used to provide an accessible label for the chart.
     */
    title: prop_types_1.default.string,
};
