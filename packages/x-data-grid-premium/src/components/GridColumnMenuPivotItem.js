"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuPivotItem = GridColumnMenuPivotItem;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var gridPivotingSelectors_1 = require("../hooks/features/pivoting/gridPivotingSelectors");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var sidebar_1 = require("../hooks/features/sidebar");
function GridColumnMenuPivotItem(props) {
    var onClick = props.onClick;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var isPivotPanelOpen = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotPanelOpenSelector);
    var openPivotSettings = function (event) {
        onClick(event);
        apiRef.current.showSidebar(sidebar_1.GridSidebarValue.Pivot);
    };
    return (<rootProps.slots.baseMenuItem onClick={openPivotSettings} iconStart={<rootProps.slots.pivotIcon fontSize="small"/>} disabled={isPivotPanelOpen}>
      {apiRef.current.getLocaleText('columnMenuManagePivot')}
    </rootProps.slots.baseMenuItem>);
}
