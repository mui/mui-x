"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNoColumnsOverlay = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridOverlay_1 = require("./containers/GridOverlay");
var gridPreferencePanelsValue_1 = require("../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var hooks_1 = require("../hooks");
var GridNoColumnsOverlay = (0, forwardRef_1.forwardRef)(function GridNoColumnsOverlay(props, ref) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columns = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridColumnFieldsSelector);
    var handleOpenManageColumns = function () {
        apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns);
    };
    var showManageColumnsButton = !rootProps.disableColumnSelector && columns.length > 0;
    return (<GridOverlay_1.GridOverlay {...props} ref={ref}>
        {apiRef.current.getLocaleText('noColumnsOverlayLabel')}
        {showManageColumnsButton && (<rootProps.slots.baseButton size="small" {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseButton} onClick={handleOpenManageColumns}>
            {apiRef.current.getLocaleText('noColumnsOverlayManageColumns')}
          </rootProps.slots.baseButton>)}
      </GridOverlay_1.GridOverlay>);
});
exports.GridNoColumnsOverlay = GridNoColumnsOverlay;
GridNoColumnsOverlay.propTypes = {
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
