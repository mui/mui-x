"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var some_awesome_library_1 = require("some-awesome-library");
function GridToolbar() {
    return <some_awesome_library_1.default />;
}
// prettier-ignore
function App() {
    return (<x_data_grid_1.DataGrid slots={{
            toolbar: GridToolbar,
        }}/>);
}
exports.default = App;
