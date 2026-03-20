"use strict";
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
exports.ChartsLayerContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var warning_1 = require("@mui/x-internals/warning");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useId_1 = require("@mui/utils/useId");
var chartsSurfaceClasses_1 = require("../ChartsSurface/chartsSurfaceClasses");
var useChartDimensions_1 = require("../internals/plugins/corePlugins/useChartDimensions");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
var ChartsProvider_1 = require("../context/ChartsProvider");
var hooks_1 = require("../hooks");
// eslint-disable-next-line import/no-cycle
var ChartsSurface_1 = require("../ChartsSurface");
var ChartsLayerContainerDiv = (0, styles_1.styled)('div', {
    name: 'MuiChartsLayerContainer',
    slot: 'Root',
})(function (_a) {
    var _b, _c;
    var ownerState = _a.ownerState;
    return ({
        width: (_b = ownerState.width) !== null && _b !== void 0 ? _b : '100%',
        height: (_c = ownerState.height) !== null && _c !== void 0 ? _c : '100%',
        // This is a hack to let the content expand a bit when possible, but not overflow when the container is too small.
        aspectRatio: '1 / 1',
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
            outline: 'none', // By default, don't show focus outline
        },
    });
});
/**
 * A component that contains the chart layers, such as `<ChartsSvgLayer>`, and `<ChartsWebGLLayer>`.
 * It is responsible for positioning itself and providing the dimensions and interaction context to its children layers.
 */
var ChartsLayerContainer = React.forwardRef(function ChartsLayerContainer(inProps, ref) {
    var _a = (0, ChartsProvider_1.useChartsContext)(), store = _a.store, instance = _a.instance;
    var propsWidth = store.use(useChartDimensions_1.selectorChartPropsWidth);
    var propsHeight = store.use(useChartDimensions_1.selectorChartPropsHeight);
    var isKeyboardNavigationEnabled = store.use(useChartKeyboardNavigation_1.selectorChartsIsKeyboardNavigationEnabled);
    var themeProps = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsLayerContainer' });
    var children = themeProps.children, title = themeProps.title, desc = themeProps.desc, className = themeProps.className, other = __rest(themeProps, ["children", "title", "desc", "className"]);
    var classes = (0, chartsSurfaceClasses_1.useUtilityClasses)();
    var chartsLayerContainerRef = (0, hooks_1.useChartsLayerContainerRef)();
    var handleRef = (0, useForkRef_1.default)(chartsLayerContainerRef, ref);
    var descId = (0, useId_1.default)();
    if (process.env.NODE_ENV !== 'production') {
        React.Children.forEach(children, function (child) {
            if (typeof child === 'object' &&
                child != null &&
                'type' in child &&
                child.type === ChartsSurface_1.ChartsSurface) {
                (0, warning_1.warnOnce)('MUI X Charts: ChartsSurface should not be used inside ChartsLayerContainer. Render a ChartsSvgLayer instead.', 'error');
            }
        });
    }
    return ((0, jsx_runtime_1.jsxs)(ChartsLayerContainerDiv, __assign({ ref: handleRef, ownerState: { width: propsWidth, height: propsHeight }, tabIndex: isKeyboardNavigationEnabled ? 0 : undefined, "aria-label": title, "aria-describedby": desc ? descId : undefined, className: (0, clsx_1.default)(classes.root, className) }, other, { onPointerEnter: function (event) {
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
        }, children: [desc && ((0, jsx_runtime_1.jsx)("span", { id: descId, style: { display: 'none' }, children: desc })), children] })));
});
exports.ChartsLayerContainer = ChartsLayerContainer;
ChartsLayerContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
