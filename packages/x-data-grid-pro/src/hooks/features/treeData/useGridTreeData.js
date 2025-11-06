"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridTreeData = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var gridTreeDataGroupColDef_1 = require("./gridTreeDataGroupColDef");
var useGridTreeData = function (apiRef, props) {
    /**
     * EVENTS
     */
    var handleCellKeyDown = React.useCallback(function (params, event) {
        var cellParams = apiRef.current.getCellParams(params.id, params.field);
        if (cellParams.colDef.field === gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_FIELD &&
            (event.key === ' ' || event.key === 'Enter') &&
            !event.shiftKey) {
            if (params.rowNode.type !== 'group') {
                return;
            }
            if (props.dataSource && !params.rowNode.childrenExpanded) {
                apiRef.current.dataSource.fetchRows(params.id);
                return;
            }
            apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
        }
    }, [apiRef, props.dataSource]);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellKeyDown', handleCellKeyDown);
};
exports.useGridTreeData = useGridTreeData;
