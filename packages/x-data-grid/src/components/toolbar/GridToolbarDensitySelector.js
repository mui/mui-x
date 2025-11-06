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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridToolbarDensitySelector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useForkRef_1 = require("@mui/utils/useForkRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var densitySelector_1 = require("../../hooks/features/density/densitySelector");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var GridMenu_1 = require("../menu/GridMenu");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
/**
 * @deprecated See {@link https://mui.com/x/react-data-grid/accessibility/#set-the-density-programmatically Accessibility—Set the density programmatically} for an example of adding a density selector to the toolbar. This component will be removed in a future major release.
 */
var GridToolbarDensitySelector = (0, forwardRef_1.forwardRef)(function GridToolbarDensitySelector(props, ref) {
    var _a, _b;
    var _c = props.slotProps, slotProps = _c === void 0 ? {} : _c;
    var buttonProps = slotProps.button || {};
    var tooltipProps = slotProps.tooltip || {};
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var density = (0, useGridSelector_1.useGridSelector)(apiRef, densitySelector_1.gridDensitySelector);
    var densityButtonId = (0, useId_1.default)();
    var densityMenuId = (0, useId_1.default)();
    var _d = React.useState(false), open = _d[0], setOpen = _d[1];
    var buttonRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, buttonRef);
    var densityOptions = [
        {
            icon: (0, jsx_runtime_1.jsx)(rootProps.slots.densityCompactIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityCompact'),
            value: 'compact',
        },
        {
            icon: (0, jsx_runtime_1.jsx)(rootProps.slots.densityStandardIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityStandard'),
            value: 'standard',
        },
        {
            icon: (0, jsx_runtime_1.jsx)(rootProps.slots.densityComfortableIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
            value: 'comfortable',
        },
    ];
    var startIcon = React.useMemo(function () {
        switch (density) {
            case 'compact':
                return (0, jsx_runtime_1.jsx)(rootProps.slots.densityCompactIcon, {});
            case 'comfortable':
                return (0, jsx_runtime_1.jsx)(rootProps.slots.densityComfortableIcon, {});
            default:
                return (0, jsx_runtime_1.jsx)(rootProps.slots.densityStandardIcon, {});
        }
    }, [density, rootProps]);
    var handleDensitySelectorOpen = function (event) {
        var _a;
        setOpen(function (prevOpen) { return !prevOpen; });
        (_a = buttonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
    };
    var handleDensitySelectorClose = function () {
        setOpen(false);
    };
    var handleDensityUpdate = function (newDensity) {
        apiRef.current.setDensity(newDensity);
        setOpen(false);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableDensitySelector) {
        return null;
    }
    var densityElements = densityOptions.map(function (option, index) { return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: function () { return handleDensityUpdate(option.value); }, selected: option.value === density, iconStart: option.icon, children: option.label }, index)); });
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, __assign({ title: apiRef.current.getLocaleText('toolbarDensityLabel'), enterDelay: 1000 }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip, tooltipProps, { children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseButton, __assign({ size: "small", startIcon: startIcon, "aria-label": apiRef.current.getLocaleText('toolbarDensityLabel'), "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? densityMenuId : undefined, id: densityButtonId }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton, buttonProps, { onClick: handleDensitySelectorOpen, ref: handleRef, children: apiRef.current.getLocaleText('toolbarDensity') })) })), (0, jsx_runtime_1.jsx)(GridMenu_1.GridMenu, { open: open, target: buttonRef.current, onClose: handleDensitySelectorClose, position: "bottom-end", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, { id: densityMenuId, className: gridClasses_1.gridClasses.menuList, "aria-labelledby": densityButtonId, autoFocusItem: open, children: densityElements }) })] }));
});
exports.GridToolbarDensitySelector = GridToolbarDensitySelector;
GridToolbarDensitySelector.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
};
