"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
function TestEvents() {
    var apiRef = (0, x_data_grid_pro_1.useGridApiContext)();
    // @ts-expect-error Argument of type '(params: GridRowParams) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', function (params) { });
    // @ts-expect-error Argument of type '(params: GridRowParams) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', function (params) { });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', 
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    function (params, event) { });
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', 
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    function (params, event) { });
    var handleCellClickWrongParams = function (params) { };
    var handleCellClickWrongEvents = function (params, event) { };
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', handleCellClickWrongParams);
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', handleCellClickWrongParams);
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', handleCellClickWrongEvents);
    // @ts-expect-error Argument of type '(params: GridCellParams, event: React.KeyboardEvent<HTMLEvent>) => void' is not assignable to parameter of type 'GridEventListener<'cellClick'>'.
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', handleCellClickWrongEvents);
    // @ts-expect-error  Argument of type '"cellTripleClick"' is not assignable to parameter of type '"resize" | "debouncedResize" | "unmount" | "cellModeChange" | "cellClick" | "cellDoubleClick" | "cellMouseDown" | "cellMouseUp" | "cellKeyDown" | "cellFocusIn" | ... 49 more'
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellTripleClick', function () { });
    // should work with valid string event name
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', function () { });
    // should work with enum event name
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellClick', function () { });
    return null;
}
