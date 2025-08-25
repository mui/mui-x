"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
// prettier-ignore
function App() {
    return (<React.Fragment>
      <x_data_grid_premium_1.DataGridPremium experimentalFeatures={{
            warnIfFocusStateIsNotSynced: true,
        }}/>
      <x_data_grid_premium_1.DataGridPremium />
      <x_data_grid_premium_1.DataGridPremium {...props}/>
    </React.Fragment>);
}
exports.default = App;
