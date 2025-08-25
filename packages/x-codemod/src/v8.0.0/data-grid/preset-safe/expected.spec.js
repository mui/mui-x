"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
/* eslint-disable react-hooks/rules-of-hooks */
var apiRef = (0, x_data_grid_1.useGridApiRef)();
var selectedRowIds = (0, x_data_grid_premium_1.gridRowSelectionIdsSelector)(apiRef);
var _a = React.useState({
    type: 'include',
    ids: new Set([1, 2, 3]),
}), rowSelectionModel = _a[0], setRowSelectionModel = _a[1];
var _b = React.useState([4, 5, 6]), rowSelectionModel1 = _b[0], setRowSelectionModel1 = _b[1];
// prettier-ignore
<React.Fragment>
  <x_data_grid_1.DataGrid rowSelectionModel={rowSelectionModel} onRowSelectionModelChange={setRowSelectionModel} rowSpanning/>
  <x_data_grid_pro_1.DataGridPro rowSpanning/>
  <x_data_grid_premium_1.DataGridPremium experimentalFeatures={{
        warnIfFocusStateIsNotSynced: true,
    }} rowSpanning/>
  <x_data_grid_premium_1.DataGridPremium rowSpanning slots={{
        toolbar: x_data_grid_1.GridToolbar,
    }} showToolbar/>
  <x_data_grid_premium_1.DataGridPremium {...props}/>
</React.Fragment>;
