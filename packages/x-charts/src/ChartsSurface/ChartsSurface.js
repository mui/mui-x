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
exports.ChartsSurface = void 0;
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var ChartsAxesGradients_1 = require("../internals/components/ChartsAxesGradients");
var useSvgRef_1 = require("../hooks/useSvgRef");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
var useChartDimensions_selectors_1 = require("../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors");
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
        // This prevents default touch actions when using the svg on mobile devices.
        // For example, prevent page scroll & zoom.
        touchAction: 'pan-y',
        userSelect: 'none',
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
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartDimensions_selectors_1.selectorChartContainerSize), svgWidth = _a.width, svgHeight = _a.height;
    var _b = (0, useSelector_1.useSelector)(store, useChartDimensions_selectors_1.selectorChartPropsSize), propsWidth = _b.width, propsHeight = _b.height;
    var svgRef = (0, useSvgRef_1.useSvgRef)();
    var handleRef = (0, useForkRef_1.default)(svgRef, ref);
    var themeProps = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsSurface' });
    var children = themeProps.children, className = themeProps.className, title = themeProps.title, desc = themeProps.desc, other = __rest(themeProps, ["children", "className", "title", "desc"]);
    var hasIntrinsicSize = svgHeight > 0 && svgWidth > 0;
    return (<ChartsSurfaceStyles ownerState={{ width: propsWidth, height: propsHeight }} viewBox={"".concat(0, " ").concat(0, " ").concat(svgWidth, " ").concat(svgHeight)} className={className} {...other} ref={handleRef}>
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      <ChartsAxesGradients_1.ChartsAxesGradients />
      {hasIntrinsicSize && children}
    </ChartsSurfaceStyles>);
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
