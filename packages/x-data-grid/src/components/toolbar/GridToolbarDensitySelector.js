"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridToolbarDensitySelector = void 0;
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
            icon: <rootProps.slots.densityCompactIcon />,
            label: apiRef.current.getLocaleText('toolbarDensityCompact'),
            value: 'compact',
        },
        {
            icon: <rootProps.slots.densityStandardIcon />,
            label: apiRef.current.getLocaleText('toolbarDensityStandard'),
            value: 'standard',
        },
        {
            icon: <rootProps.slots.densityComfortableIcon />,
            label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
            value: 'comfortable',
        },
    ];
    var startIcon = React.useMemo(function () {
        switch (density) {
            case 'compact':
                return <rootProps.slots.densityCompactIcon />;
            case 'comfortable':
                return <rootProps.slots.densityComfortableIcon />;
            default:
                return <rootProps.slots.densityStandardIcon />;
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
    var densityElements = densityOptions.map(function (option, index) { return (<rootProps.slots.baseMenuItem key={index} onClick={function () { return handleDensityUpdate(option.value); }} selected={option.value === density} iconStart={option.icon}>
        {option.label}
      </rootProps.slots.baseMenuItem>); });
    return (<React.Fragment>
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarDensityLabel')} enterDelay={1000} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip} {...tooltipProps}>
          <rootProps.slots.baseButton size="small" startIcon={startIcon} aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? densityMenuId : undefined} id={densityButtonId} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton} {...buttonProps} onClick={handleDensitySelectorOpen} ref={handleRef}>
            {apiRef.current.getLocaleText('toolbarDensity')}
          </rootProps.slots.baseButton>
        </rootProps.slots.baseTooltip>
        <GridMenu_1.GridMenu open={open} target={buttonRef.current} onClose={handleDensitySelectorClose} position="bottom-end">
          <rootProps.slots.baseMenuList id={densityMenuId} className={gridClasses_1.gridClasses.menuList} aria-labelledby={densityButtonId} autoFocusItem={open}>
            {densityElements}
          </rootProps.slots.baseMenuList>
        </GridMenu_1.GridMenu>
      </React.Fragment>);
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
