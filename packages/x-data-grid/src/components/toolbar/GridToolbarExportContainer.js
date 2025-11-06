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
exports.GridToolbarExportContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var useForkRef_1 = require("@mui/utils/useForkRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var GridMenu_1 = require("../menu/GridMenu");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var GridToolbarExportContainer = (0, forwardRef_1.forwardRef)(function GridToolbarExportContainer(props, ref) {
    var _a, _b;
    var children = props.children, _c = props.slotProps, slotProps = _c === void 0 ? {} : _c;
    var buttonProps = slotProps.button || {};
    var tooltipProps = slotProps.tooltip || {};
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var exportButtonId = (0, useId_1.default)();
    var exportMenuId = (0, useId_1.default)();
    var _d = React.useState(false), open = _d[0], setOpen = _d[1];
    var buttonRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, buttonRef);
    var handleMenuOpen = function (event) {
        var _a;
        setOpen(function (prevOpen) { return !prevOpen; });
        (_a = buttonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
    };
    var handleMenuClose = function () { return setOpen(false); };
    if (children == null) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, __assign({ title: apiRef.current.getLocaleText('toolbarExportLabel'), enterDelay: 1000 }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip, tooltipProps, { children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseButton, __assign({ size: "small", startIcon: (0, jsx_runtime_1.jsx)(rootProps.slots.exportIcon, {}), "aria-expanded": open, "aria-label": apiRef.current.getLocaleText('toolbarExportLabel'), "aria-haspopup": "menu", "aria-controls": open ? exportMenuId : undefined, id: exportButtonId }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton, buttonProps, { onClick: handleMenuOpen, ref: handleRef, children: apiRef.current.getLocaleText('toolbarExport') })) })), (0, jsx_runtime_1.jsx)(GridMenu_1.GridMenu, { open: open, target: buttonRef.current, onClose: handleMenuClose, position: "bottom-end", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, { id: exportMenuId, className: gridClasses_1.gridClasses.menuList, "aria-labelledby": exportButtonId, autoFocusItem: open, children: React.Children.map(children, function (child) {
                        if (!React.isValidElement(child)) {
                            return child;
                        }
                        return React.cloneElement(child, { hideMenu: handleMenuClose });
                    }) }) })] }));
});
exports.GridToolbarExportContainer = GridToolbarExportContainer;
GridToolbarExportContainer.propTypes = {
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
