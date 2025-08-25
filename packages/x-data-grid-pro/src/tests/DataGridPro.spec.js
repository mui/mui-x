"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
function SxTest() {
    <x_data_grid_pro_1.DataGridPro rows={[]} columns={[]} sx={{ color: 'primary.main' }}/>;
}
function ColumnPropTest() {
    return (<div>
      {/* Wrong column with explicit generic on DataGrid */}
      <x_data_grid_pro_1.DataGridPro rows={[]} columns={[
            {
                field: 'firstName',
                // @ts-expect-error
                valueGetter: function (value, row) { return row.lastName; },
            },
        ]}/>
      {/* Valid column with explicit generic on DataGrid */}
      <x_data_grid_pro_1.DataGridPro rows={[]} columns={[
            {
                field: 'firstName',
                valueGetter: function (value, row) { return row.firstName; },
            },
        ]}/>
      {/* Wrong column without explicit generic on DataGrid */}
      <x_data_grid_pro_1.DataGridPro rows={[{ firstName: 'John' }]} columns={[
            {
                field: 'firstName',
                // @ts-expect-error
                valueGetter: function (value, row) { return row.lastName; },
            },
        ]}/>
      {/* Valid column without explicit generic on DataGrid */}
      <x_data_grid_pro_1.DataGridPro rows={[{ firstName: 'John' }]} columns={[
            {
                field: 'firstName',
                valueGetter: function (value, row) { return row.firstName; },
            },
        ]}/>
    </div>);
}
function ApiRefPrivateMethods() {
    var apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
    React.useEffect(function () {
        // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiPro'
        apiRef.current.updateControlState;
        // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiPro'
        apiRef.current.registerControlState;
        // @ts-expect-error Property 'caches' does not exist on type 'GridApiPro'
        apiRef.current.caches;
        // @ts-expect-error Property 'eventManager' does not exist on type 'GridApiPro'
        apiRef.current.eventManager;
        // @ts-expect-error Property 'registerPipeProcessor' does not exist on type 'GridApiPro'
        apiRef.current.registerPipeProcessor;
        // @ts-expect-error Property 'registerPipeApplier' does not exist on type 'GridApiPro'
        apiRef.current.registerPipeApplier;
        // @ts-expect-error Property 'requestPipeProcessorsApplication' does not exist on type 'GridApiPro'
        apiRef.current.requestPipeProcessorsApplication;
        // @ts-expect-error Property 'registerStrategyProcessor' does not exist on type 'GridApiPro'
        apiRef.current.registerStrategyProcessor;
        // @ts-expect-error Property 'setStrategyAvailability' does not exist on type 'GridApiPro'
        apiRef.current.setStrategyAvailability;
        // @ts-expect-error Property 'getActiveStrategy' does not exist on type 'GridApiPro'
        apiRef.current.getActiveStrategy;
        // @ts-expect-error Property 'applyStrategyProcessor' does not exist on type 'GridApiPro'
        apiRef.current.applyStrategyProcessor;
        // @ts-expect-error Property 'storeDetailPanelHeight' does not exist on type 'GridApiPro'
        apiRef.current.storeDetailPanelHeight;
        // @ts-expect-error Property 'calculateColSpan' does not exist on type 'GridApiPro'
        apiRef.current.calculateColSpan;
        // @ts-expect-error Property 'rowHasAutoHeight' does not exist on type 'GridApiPro'
        apiRef.current.rowHasAutoHeight;
        // @ts-expect-error Property 'getLastMeasuredRowIndex' does not exist on type 'GridApiPro'
        apiRef.current.getLastMeasuredRowIndex;
        // @ts-expect-error Property 'getViewportPageSize' does not exist on type 'GridApiPro'
        apiRef.current.getViewportPageSize;
        // @ts-expect-error Property 'setCellEditingEditCellValue' does not exist on type 'GridApiPro'
        apiRef.current.setCellEditingEditCellValue;
        // @ts-expect-error Property 'getRowWithUpdatedValuesFromCellEditing' does not exist on type 'GridApiPro'
        apiRef.current.getRowWithUpdatedValuesFromCellEditing;
        // @ts-expect-error Property 'setRowEditingEditCellValue' does not exist on type 'GridApiPro'
        apiRef.current.setRowEditingEditCellValue;
        // @ts-expect-error Property 'getRowWithUpdatedValuesFromRowEditing' does not exist on type 'GridApiPro'
        apiRef.current.getRowWithUpdatedValuesFromRowEditing;
        // @ts-expect-error Property 'runPendingEditCellValueMutation' does not exist on type 'GridApiPro'
        apiRef.current.runPendingEditCellValueMutation;
        // @ts-expect-error Property 'getLogger' does not exist on type 'GridApiPro'
        apiRef.current.getLogger;
        // @ts-expect-error Property 'moveFocusToRelativeCell' does not exist on type 'GridApiPro'
        apiRef.current.moveFocusToRelativeCell;
        // @ts-expect-error Property 'setColumnGroupHeaderFocus' does not exist on type 'GridApiPro'
        apiRef.current.setColumnGroupHeaderFocus;
        // @ts-expect-error Property 'getColumnGroupHeaderFocus' does not exist on type 'GridApiPro'
        apiRef.current.getColumnGroupHeaderFocus;
    });
    return null;
}
function ApiRefPublicMethods() {
    var apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
    apiRef.current.unstable_applyPipeProcessors('exportMenu', [], {});
}
function ApiRefProMethods() {
    var apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
    React.useEffect(function () {
        // available in Pro and Premium
        apiRef.current.selectRows([]);
        apiRef.current.selectRowRange({ startId: 0, endId: 1 });
        apiRef.current.setColumnIndex;
        apiRef.current.setRowIndex;
        apiRef.current.setRowChildrenExpansion;
        apiRef.current.getRowGroupChildren;
    });
    return null;
}
