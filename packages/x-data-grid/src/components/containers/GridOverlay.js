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
exports.GridOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var cssVariables_1 = require("../../constants/cssVariables");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['overlay'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridOverlayRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'Overlay',
})({
    width: '100%',
    height: '100%',
    display: 'flex',
    gap: cssVariables_1.vars.spacing(1),
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textWrap: 'balance',
    backgroundColor: cssVariables_1.vars.colors.background.backdrop,
});
var GridOverlay = (0, forwardRef_1.forwardRef)(function GridOverlay(props, ref) {
    var className = props.className, other = __rest(props, ["className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return ((0, jsx_runtime_1.jsx)(GridOverlayRoot, __assign({ className: (0, clsx_1.default)(classes.root, className), ownerState: rootProps }, other, { ref: ref })));
});
exports.GridOverlay = GridOverlay;
GridOverlay.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
