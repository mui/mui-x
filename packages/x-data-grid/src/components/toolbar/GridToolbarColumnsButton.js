"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridToolbarColumnsButton = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridPreferencePanelSelector_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var gridPreferencePanelsValue_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridPanelContext_1 = require("../panel/GridPanelContext");
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/columns-panel/ Columns Panel Trigger} component instead. This component will be removed in a future major release.
 */
var GridToolbarColumnsButton = (0, forwardRef_1.forwardRef)(function GridToolbarColumnsButton(props, ref) {
    var _a, _b;
    var _c = props.slotProps, slotProps = _c === void 0 ? {} : _c;
    var buttonProps = slotProps.button || {};
    var tooltipProps = slotProps.tooltip || {};
    var columnButtonId = (0, useId_1.default)();
    var columnPanelId = (0, useId_1.default)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var columnsPanelTriggerRef = (0, GridPanelContext_1.useGridPanelContext)().columnsPanelTriggerRef;
    var preferencePanel = (0, useGridSelector_1.useGridSelector)(apiRef, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector);
    var handleRef = (0, useForkRef_1.default)(ref, columnsPanelTriggerRef);
    var showColumns = function (event) {
        var _a;
        if (preferencePanel.open &&
            preferencePanel.openedPanelValue === gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns) {
            apiRef.current.hidePreferences();
        }
        else {
            apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns, columnPanelId, columnButtonId);
        }
        (_a = buttonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
        return null;
    }
    var isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;
    return (<rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarColumnsLabel')} enterDelay={1000} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip} {...tooltipProps}>
        <rootProps.slots.baseButton id={columnButtonId} size="small" aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={isOpen ? columnPanelId : undefined} startIcon={<rootProps.slots.columnSelectorIcon />} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton} {...buttonProps} onPointerUp={function (event) {
            var _a;
            if (preferencePanel.open) {
                event.stopPropagation();
            }
            (_a = buttonProps.onPointerUp) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
        }} onClick={showColumns} ref={handleRef}>
          {apiRef.current.getLocaleText('toolbarColumns')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>);
});
exports.GridToolbarColumnsButton = GridToolbarColumnsButton;
GridToolbarColumnsButton.propTypes = {
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
