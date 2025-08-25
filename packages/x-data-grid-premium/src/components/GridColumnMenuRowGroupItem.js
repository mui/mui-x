"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuRowGroupItem = GridColumnMenuRowGroupItem;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridRowGroupingSelector_1 = require("../hooks/features/rowGrouping/gridRowGroupingSelector");
var gridRowGroupingUtils_1 = require("../hooks/features/rowGrouping/gridRowGroupingUtils");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
function GridColumnMenuRowGroupItem(props) {
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rowGroupingModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    var columnsLookup = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridColumnLookupSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var renderUnGroupingMenuItem = function (field) {
        var _a;
        var ungroupColumn = function (event) {
            apiRef.current.removeRowGroupingCriteria(field);
            onClick(event);
        };
        var groupedColumn = columnsLookup[field];
        var name = (_a = groupedColumn.headerName) !== null && _a !== void 0 ? _a : field;
        return (<rootProps.slots.baseMenuItem onClick={ungroupColumn} key={field} disabled={!groupedColumn.groupable} iconStart={<rootProps.slots.columnMenuUngroupIcon fontSize="small"/>}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </rootProps.slots.baseMenuItem>);
    };
    if (!colDef || !(0, gridRowGroupingUtils_1.isGroupingColumn)(colDef.field)) {
        return null;
    }
    if (colDef.field === gridRowGroupingUtils_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
        return <React.Fragment>{rowGroupingModel.map(renderUnGroupingMenuItem)}</React.Fragment>;
    }
    return renderUnGroupingMenuItem((0, gridRowGroupingUtils_1.getRowGroupingCriteriaFromGroupingField)(colDef.field));
}
