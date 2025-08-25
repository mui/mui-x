"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var columns = [{ field: 'column' }];
var rows = [
    { id: 1, column: 'a', name: 'John', score: 100 },
    { id: 2, column: 'b', name: 'Steward', score: 200 },
    { id: 3, column: 'c', name: 'James', score: 300 },
];
// prettier-ignore
function App() {
    var _a = React.useState({
        items: [
            {
                field: 'name',
                operator: 'startsWith',
                value: 'J',
            },
        ],
    }), proFilterModel = _a[0], setProFilterModel = _a[1];
    var premiumFilterModel = React.useRef({
        items: [
            {
                field: 'score',
                operator: '>',
                value: 100,
            },
        ],
    });
    return (<React.Fragment>
      <x_data_grid_1.DataGrid columns={columns} rows={rows} initialState={{
            filter: {
                filterModel: {
                    items: [
                        {
                            field: 'column',
                            operator: 'contains',
                            value: 'a',
                        },
                    ],
                },
            },
        }} filterModel={{
            items: [
                {
                    field: 'column',
                    operator: 'contains',
                    value: 'a',
                },
            ],
        }}/>
      <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} filterModel={proFilterModel} onFilterModelChange={function (model) { return setProFilterModel(model); }}/>
      <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} filterModel={premiumFilterModel.current} onFilterModelChange={function (model) {
            premiumFilterModel.current = model;
        }}/>
    </React.Fragment>);
}
