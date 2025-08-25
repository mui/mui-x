"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuHideItem = GridColumnMenuHideItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var useGridApiContext_1 = require("../../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../../hooks/utils/useGridRootProps");
var columns_1 = require("../../../../hooks/features/columns");
function GridColumnMenuHideItem(props) {
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var visibleColumns = (0, columns_1.gridVisibleColumnDefinitionsSelector)(apiRef);
    var columnsWithMenu = visibleColumns.filter(function (col) { return col.disableColumnMenu !== true; });
    // do not allow to hide the last column with menu
    var disabled = columnsWithMenu.length === 1;
    var toggleColumn = React.useCallback(function (event) {
        /**
         * Disabled `MenuItem` would trigger `click` event
         * after imperative `.click()` call on HTML element.
         * Also, click is triggered in testing environment as well.
         */
        if (disabled) {
            return;
        }
        apiRef.current.setColumnVisibility(colDef.field, false);
        onClick(event);
    }, [apiRef, colDef.field, onClick, disabled]);
    if (rootProps.disableColumnSelector) {
        return null;
    }
    if (colDef.hideable === false) {
        return null;
    }
    return (<rootProps.slots.baseMenuItem onClick={toggleColumn} disabled={disabled} iconStart={<rootProps.slots.columnMenuHideIcon fontSize="small"/>}>
      {apiRef.current.getLocaleText('columnMenuHideColumn')}
    </rootProps.slots.baseMenuItem>);
}
GridColumnMenuHideItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
