"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuManageItem = GridColumnMenuManageItem;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: showColumns, iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuManageColumnsIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('columnMenuManageColumns') }));
}
GridColumnMenuManageItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
