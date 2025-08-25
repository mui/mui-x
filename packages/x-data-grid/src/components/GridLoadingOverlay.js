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
exports.GridLoadingOverlay = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridOverlay_1 = require("./containers/GridOverlay");
var GridSkeletonLoadingOverlay_1 = require("./GridSkeletonLoadingOverlay");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var hooks_1 = require("../hooks");
var LOADING_VARIANTS = {
    'circular-progress': {
        component: function (rootProps) { return rootProps.slots.baseCircularProgress; },
        style: {},
    },
    'linear-progress': {
        component: function (rootProps) { return rootProps.slots.baseLinearProgress; },
        style: { display: 'block' },
    },
    skeleton: {
        component: function () { return GridSkeletonLoadingOverlay_1.GridSkeletonLoadingOverlay; },
        style: { display: 'block' },
    },
};
var GridLoadingOverlay = (0, forwardRef_1.forwardRef)(function GridLoadingOverlay(props, ref) {
    var _a = props.variant, variant = _a === void 0 ? 'linear-progress' : _a, _b = props.noRowsVariant, noRowsVariant = _b === void 0 ? 'skeleton' : _b, style = props.style, other = __rest(props, ["variant", "noRowsVariant", "style"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var rowsCount = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridRowCountSelector);
    var activeVariant = LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    var Component = activeVariant.component(rootProps);
    return (<GridOverlay_1.GridOverlay style={__assign(__assign({}, activeVariant.style), style)} {...other} ref={ref}>
        <Component />
      </GridOverlay_1.GridOverlay>);
});
exports.GridLoadingOverlay = GridLoadingOverlay;
GridLoadingOverlay.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The variant of the overlay when no rows are displayed.
     * @default 'skeleton'
     */
    noRowsVariant: prop_types_1.default.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * The variant of the overlay.
     * @default 'linear-progress'
     */
    variant: prop_types_1.default.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
};
