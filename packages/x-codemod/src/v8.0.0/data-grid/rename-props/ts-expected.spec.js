"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var dataSource = {
    getRows: function () { return Promise.resolve([]); },
};
var dataSourceCache = {};
// prettier-ignore
function App() {
    return (<React.Fragment>
      <x_data_grid_1.DataGrid rowSpanning/>
      <x_data_grid_pro_1.DataGridPro rowSpanning/>
      <x_data_grid_premium_1.DataGridPremium rowSpanning dataSource={dataSource} dataSourceCache={dataSourceCache} listView listViewColumn={{}}/>
    </React.Fragment>);
}
exports.default = App;
