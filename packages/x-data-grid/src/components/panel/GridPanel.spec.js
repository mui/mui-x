"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
function MyPanel() {
    return (<div>
      <x_data_grid_1.GridPanel classes={{ paper: 'paper' }} open flip={false}/>
      {/* @ts-expect-error foo classes doesn't exist */}
      <x_data_grid_1.GridPanel classes={{ foo: 'foo' }}/>
    </div>);
}
