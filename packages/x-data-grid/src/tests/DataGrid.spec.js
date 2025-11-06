"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
function PropTest() {
    var apiRef = (0, x_data_grid_1.useGridApiRef)();
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [], pagination: true }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { pagination: false }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { apiRef: apiRef }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [], localeText: {} }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [] })] }));
}
function SxTest() {
    (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [], sx: { color: 'primary.main' } });
}
function CellEditingProps() {
    (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [], onCellEditStart: function (params) { }, onCellEditStop: function (params) { } });
}
function RowEditingProps() {
    (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [], onRowEditStart: function (params) { }, onRowEditStop: function (params) { } });
}
function RowPropTest() {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{ firstName: 2 }], columns: [] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{}], columns: [] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{ firstName: 'John' }], columns: [] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{ firstName: 'John' }], columns: [] })] }));
}
function ColumnPropTest() {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [
                    {
                        field: 'firstName',
                        // @ts-expect-error
                        valueGetter: function (value, row) { return row.lastName; },
                        // @ts-expect-error
                        valueParser: function (value, row) { return row.lastName; },
                        valueSetter: function (value, row) {
                            // @ts-expect-error
                            var lastName = row.lastName;
                            return {};
                        },
                        // @ts-expect-error
                        renderCell: function (params) { return params.row.lastName; },
                    },
                ] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [
                    {
                        field: 'firstName',
                        valueGetter: function (value, row) { return row.firstName; },
                        valueParser: function (value, row) { return row.firstName; },
                        valueSetter: function (value, row) {
                            var firstName = row.firstName;
                            return {};
                        },
                        renderCell: function (params) { return params.row.firstName; },
                    },
                ] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{ firstName: 'John' }], columns: [
                    {
                        field: 'firstName',
                        // @ts-expect-error
                        valueGetter: function (value, row) { return row.lastName; },
                        // @ts-expect-error
                        valueParser: function (value, row) { return row.lastName; },
                        valueSetter: function (value, row) {
                            // @ts-expect-error
                            var lastName = row.lastName;
                            return {};
                        },
                        // @ts-expect-error
                        renderCell: function (params) { return params.row.lastName; },
                    },
                ] }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [{ firstName: 'John' }], columns: [
                    {
                        field: 'firstName',
                        valueGetter: function (value, row) { return row.firstName; },
                        valueParser: function (value, row) { return row.firstName; },
                        valueSetter: function (value, row) {
                            var firstName = row.firstName;
                            return {};
                        },
                        renderCell: function (params) { return params.row.firstName; },
                    },
                ] })] }));
}
function SingleSelectColDef() {
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: [], columns: [
                {
                    field: 'country',
                    type: 'string',
                    // @ts-expect-error
                    valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
                },
                {
                    field: 'country',
                    type: 'singleSelect',
                    valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
                },
                {
                    field: 'country',
                    type: 'singleSelect',
                    valueOptions: [
                        { value: 'UK', label: 'United Kingdom' },
                        { value: 'ES', label: 'Spain' },
                        { value: 'BR', label: 'Brazil' },
                    ],
                },
                {
                    field: 'country',
                    type: 'singleSelect',
                    getOptionValue: function (value) { return value.code; },
                    getOptionLabel: function (value) { return value.label; },
                    valueOptions: [
                        { code: 'UK', name: 'United Kingdom' },
                        { code: 'ES', name: 'Spain' },
                        { code: 'BR', name: 'Brazil' },
                    ],
                },
            ] }) }));
}
function ApiRefPrivateMethods() {
    var apiRef = (0, x_data_grid_1.useGridApiRef)();
    React.useEffect(function () {
        // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiCommunity'
        apiRef.current.updateControlState;
        // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiCommunity'
        apiRef.current.registerControlState;
        // @ts-expect-error Property 'caches' does not exist on type 'GridApiCommunity'
        apiRef.current.caches;
        // @ts-expect-error Property 'eventManager' does not exist on type 'GridApiCommunity'
        apiRef.current.eventManager;
        // @ts-expect-error Property 'registerPipeProcessor' does not exist on type 'GridApiCommunity'
        apiRef.current.registerPipeProcessor;
        // @ts-expect-error Property 'registerPipeApplier' does not exist on type 'GridApiCommunity'
        apiRef.current.registerPipeApplier;
        // @ts-expect-error Property 'requestPipeProcessorsApplication' does not exist on type 'GridApiCommunity'
        apiRef.current.requestPipeProcessorsApplication;
        // @ts-expect-error Property 'registerStrategyProcessor' does not exist on type 'GridApiCommunity'
        apiRef.current.registerStrategyProcessor;
        // @ts-expect-error Property 'setStrategyAvailability' does not exist on type 'GridApiCommunity'
        apiRef.current.setStrategyAvailability;
        // @ts-expect-error Property 'getActiveStrategy' does not exist on type 'GridApiCommunity'
        apiRef.current.getActiveStrategy;
        // @ts-expect-error Property 'applyStrategyProcessor' does not exist on type 'GridApiCommunity'
        apiRef.current.applyStrategyProcessor;
        // @ts-expect-error Property 'storeDetailPanelHeight' does not exist on type 'GridApiCommunity'
        apiRef.current.storeDetailPanelHeight;
        // @ts-expect-error Property 'calculateColSpan' does not exist on type 'GridApiCommunity'
        apiRef.current.calculateColSpan;
        // @ts-expect-error Property 'rowHasAutoHeight' does not exist on type 'GridApiCommunity'
        apiRef.current.rowHasAutoHeight;
        // @ts-expect-error Property 'getLastMeasuredRowIndex' does not exist on type 'GridApiCommunity'
        apiRef.current.getLastMeasuredRowIndex;
        // @ts-expect-error Property 'getViewportPageSize' does not exist on type 'GridApiCommunity'
        apiRef.current.getViewportPageSize;
        // @ts-expect-error Property 'setCellEditingEditCellValue' does not exist on type 'GridApiCommunity'
        apiRef.current.setCellEditingEditCellValue;
        // @ts-expect-error Property 'getRowWithUpdatedValuesFromCellEditing' does not exist on type 'GridApiCommunity'
        apiRef.current.getRowWithUpdatedValuesFromCellEditing;
        // @ts-expect-error Property 'setRowEditingEditCellValue' does not exist on type 'GridApiCommunity'
        apiRef.current.setRowEditingEditCellValue;
        // @ts-expect-error Property 'getRowWithUpdatedValuesFromRowEditing' does not exist on type 'GridApiCommunity'
        apiRef.current.getRowWithUpdatedValuesFromRowEditing;
        // @ts-expect-error Property 'runPendingEditCellValueMutation' does not exist on type 'GridApiCommunity'
        apiRef.current.runPendingEditCellValueMutation;
        // @ts-expect-error Property 'getLogger' does not exist on type 'GridApiCommunity'
        apiRef.current.getLogger;
        // @ts-expect-error Property 'moveFocusToRelativeCell' does not exist on type 'GridApiCommunity'
        apiRef.current.moveFocusToRelativeCell;
        // @ts-expect-error Property 'setColumnGroupHeaderFocus' does not exist on type 'GridApiCommunity'
        apiRef.current.setColumnGroupHeaderFocus;
        // @ts-expect-error Property 'getColumnGroupHeaderFocus' does not exist on type 'GridApiCommunity'
        apiRef.current.getColumnGroupHeaderFocus;
        // @ts-expect-error Property 'setColumnIndex' does not exist on type 'GridApiCommunity'
        apiRef.current.setColumnIndex;
        // @ts-expect-error Property 'setRowIndex' does not exist on type 'GridApiCommunity'
        apiRef.current.setRowIndex;
        // @ts-expect-error Property 'setRowChildrenExpansion' does not exist on type 'GridApiCommunity'
        apiRef.current.setRowChildrenExpansion;
        // @ts-expect-error Property 'getRowGroupChildren' does not exist on type 'GridApiCommunity'
        apiRef.current.getRowGroupChildren;
    });
    return null;
}
function ApiRefPublicMethods() {
    var apiRef = (0, x_data_grid_1.useGridApiRef)();
    apiRef.current.unstable_applyPipeProcessors('exportMenu', [], {});
}
function ApiRefProMethods() {
    var apiRef = (0, x_data_grid_1.useGridApiRef)();
    React.useEffect(function () {
        // available only in Pro and Premium
        // @ts-expect-error Property 'selectRows' does not exist on type 'GridApiCommunity'
        apiRef.current.selectRows([]);
        // @ts-expect-error Property 'selectRowRange' does not exist on type 'GridApiCommunity'
        apiRef.current.selectRowRange({ startId: 0, endId: 1 });
    });
    return null;
}
function ImmutableProps() {
    var rows = [];
    var columns = [];
    var initialState = { sorting: { sortModel: [{ field: 'id', sort: 'asc' }] } };
    return (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: rows, columns: columns, initialState: initialState });
}
