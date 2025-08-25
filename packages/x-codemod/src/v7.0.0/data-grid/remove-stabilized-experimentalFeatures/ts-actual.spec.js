"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
// prettier-ignore
function App() {
    return (<React.Fragment>
      <x_data_grid_1.DataGrid experimentalFeatures={{
            columnGrouping: true,
            clipboardPaste: true,
        }}/>
      <x_data_grid_pro_1.DataGridPro experimentalFeatures={{
            lazyLoading: true,
            ariaV7: true,
        }}/>
      <x_data_grid_premium_1.DataGridPremium experimentalFeatures={{
            columnGrouping: true,
            clipboardPaste: true,
            lazyLoading: true,
            ariaV7: true,
        }}/>
      <x_data_grid_pro_1.DataGridPro {...props}/>
    </React.Fragment>);
}
exports.default = App;
