"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuRowUngroupItem = GridColumnMenuRowUngroupItem;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridRowGroupingSelector_1 = require("../hooks/features/rowGrouping/gridRowGroupingSelector");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
function GridColumnMenuRowUngroupItem(props) {
    var _a;
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rowGroupingModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    var columnsLookup = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridColumnLookupSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (!colDef.groupable) {
        return null;
    }
    var ungroupColumn = function (event) {
        apiRef.current.removeRowGroupingCriteria(colDef.field);
        onClick(event);
    };
    var groupColumn = function (event) {
        apiRef.current.addRowGroupingCriteria(colDef.field);
        onClick(event);
    };
    var name = (_a = columnsLookup[colDef.field].headerName) !== null && _a !== void 0 ? _a : colDef.field;
    if (rowGroupingModel.includes(colDef.field)) {
        return (<rootProps.slots.baseMenuItem onClick={ungroupColumn} iconStart={<rootProps.slots.columnMenuUngroupIcon fontSize="small"/>}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </rootProps.slots.baseMenuItem>);
    }
    return (<rootProps.slots.baseMenuItem onClick={groupColumn} iconStart={<rootProps.slots.columnMenuGroupIcon fontSize="small"/>}>
      {apiRef.current.getLocaleText('groupColumn')(name)}
    </rootProps.slots.baseMenuItem>);
}
