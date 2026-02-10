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
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var clsx_1 = require("clsx");
var ChartsAxesGradients_1 = require("../internals/components/ChartsAxesGradients");
var useSvgRef_1 = require("../hooks/useSvgRef");
var ChartProvider_1 = require("../context/ChartProvider");
var useChartDimensions_selectors_1 = require("../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var chartsSurfaceClasses_1 = require("./chartsSurfaceClasses");
var ChartsSurfaceStyles = (0, styles_1.styled)('svg', {
    name: 'MuiChartsSurface',
    slot: 'Root',
})(function (_a) {
    var _b, _c;
    var ownerState = _a.ownerState;
    return ({
        width: (_b = ownerState.width) !== null && _b !== void 0 ? _b : '100%',
        height: (_c = ownerState.height) !== null && _c !== void 0 ? _c : '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'pan-y',
        userSelect: 'none',
        gridArea: 'chart',
        '&:focus': {
            outline: 'none', // By default don't show focus on the SVG container
        },
    });
});
/**
 * It provides the drawing area for the chart elements.
 * It is the root `<svg>` of all the chart elements.
 *
 * It also provides the `title` and `desc` elements for the chart.
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
    var _a = (0, ChartProvider_1.useChartContext)(), store = _a.store, instance = _a.instance;
    var svgWidth = store.use(useChartDimensions_selectors_1.selectorChartSvgWidth);
    var svgHeight = store.use(useChartDimensions_selectors_1.selectorChartSvgHeight);
    var propsWidth = store.use(useChartDimensions_selectors_1.selectorChartPropsWidth);
    var propsHeight = store.use(useChartDimensions_selectors_1.selectorChartPropsHeight);
    var isKeyboardNavigationEnabled = store.use(useChartKeyboardNavigation_1.selectorChartsIsKeyboardNavigationEnabled);
    var svgRef = (0, useSvgRef_1.useSvgRef)();
    var handleRef = (0, useForkRef_1.default)(svgRef, ref);
    var themeProps = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsSurface' });
    var children = themeProps.children, className = themeProps.className, title = themeProps.title, desc = themeProps.desc, other = __rest(themeProps, ["children", "className", "title", "desc"]);
    var classes = (0, chartsSurfaceClasses_1.useUtilityClasses)();
    var hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;
    return ((0, jsx_runtime_1.jsxs)(ChartsSurfaceStyles, __assign({ ownerState: { width: propsWidth, height: propsHeight }, viewBox: "".concat(0, " ").concat(0, " ").concat(svgWidth, " ").concat(svgHeight), className: (0, clsx_1.default)(classes.root, className), tabIndex: isKeyboardNavigationEnabled ? 0 : undefined }, other, { onPointerEnter: function (event) {
            var _a, _b;
            (_a = other.onPointerEnter) === null || _a === void 0 ? void 0 : _a.call(other, event);
            (_b = instance.handlePointerEnter) === null || _b === void 0 ? void 0 : _b.call(instance, event);
        }, onPointerLeave: function (event) {
            var _a, _b;
            (_a = other.onPointerLeave) === null || _a === void 0 ? void 0 : _a.call(other, event);
            (_b = instance.handlePointerLeave) === null || _b === void 0 ? void 0 : _b.call(instance, event);
        }, onClick: function (event) {
            var _a, _b;
            (_a = other.onClick) === null || _a === void 0 ? void 0 : _a.call(other, event);
            (_b = instance.handleClick) === null || _b === void 0 ? void 0 : _b.call(instance, event);
        }, ref: handleRef, children: [title && (0, jsx_runtime_1.jsx)("title", { children: title }), desc && (0, jsx_runtime_1.jsx)("desc", { children: desc }), (0, jsx_runtime_1.jsx)(ChartsAxesGradients_1.ChartsAxesGradients, {}), hasIntrinsicSize && children] })));
});
exports.ChartsSurface = ChartsSurface;
ChartsSurface.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    desc: prop_types_1.default.string,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    title: prop_types_1.default.string,
};
