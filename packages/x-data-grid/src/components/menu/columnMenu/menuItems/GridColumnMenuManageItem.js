"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuManageItem = GridColumnMenuManageItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var gridPreferencePanelsValue_1 = require("../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var useGridApiContext_1 = require("../../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../../hooks/utils/useGridRootProps");
function GridColumnMenuManageItem(props) {
    var onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var showColumns = React.useCallback(function (event) {
        onClick(event); // hide column menu
        apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns);
    }, [apiRef, onClick]);
    if (rootProps.disableColumnSelector) {
        return null;
    }
    return (<rootProps.slots.baseMenuItem onClick={showColumns} iconStart={<rootProps.slots.columnMenuManageColumnsIcon fontSize="small"/>}>
      {apiRef.current.getLocaleText('columnMenuManageColumns')}
    </rootProps.slots.baseMenuItem>);
}
GridColumnMenuManageItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
