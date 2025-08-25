"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
// prettier-ignore
function App(_a) {
    var column = _a.column, hideMenu = _a.hideMenu;
    return (<React.Fragment>
      <x_data_grid_premium_1.GridColumnMenuFilterItem colDef={column} onClick={hideMenu}/>
      <x_data_grid_premium_1.GridColumnMenuHideItem colDef={column} onClick={hideMenu}/>
      <x_data_grid_premium_1.GridColumnMenuColumnsItem colDef={column} onClick={hideMenu}/>
      <x_data_grid_premium_1.GridColumnMenuSortItem colDef={column} onClick={hideMenu}/>
      <x_data_grid_premium_1.GridColumnMenuPinningItem colDef={column} onClick={hideMenu}/>
      <x_data_grid_premium_1.GridColumnMenuAggregationItem colDef={column} onClick={hideMenu}/>
    </React.Fragment>);
}
