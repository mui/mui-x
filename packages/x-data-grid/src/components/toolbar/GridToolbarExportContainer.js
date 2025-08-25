"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridToolbarExportContainer = void 0;
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
    return (<React.Fragment>
      <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarExportLabel')} enterDelay={1000} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip} {...tooltipProps}>
        <rootProps.slots.baseButton size="small" startIcon={<rootProps.slots.exportIcon />} aria-expanded={open} aria-label={apiRef.current.getLocaleText('toolbarExportLabel')} aria-haspopup="menu" aria-controls={open ? exportMenuId : undefined} id={exportButtonId} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton} {...buttonProps} onClick={handleMenuOpen} ref={handleRef}>
          {apiRef.current.getLocaleText('toolbarExport')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>
      <GridMenu_1.GridMenu open={open} target={buttonRef.current} onClose={handleMenuClose} position="bottom-end">
        <rootProps.slots.baseMenuList id={exportMenuId} className={gridClasses_1.gridClasses.menuList} aria-labelledby={exportButtonId} autoFocusItem={open}>
          {React.Children.map(children, function (child) {
            if (!React.isValidElement(child)) {
                return child;
            }
            return React.cloneElement(child, { hideMenu: handleMenuClose });
        })}
        </rootProps.slots.baseMenuList>
      </GridMenu_1.GridMenu>
    </React.Fragment>);
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
