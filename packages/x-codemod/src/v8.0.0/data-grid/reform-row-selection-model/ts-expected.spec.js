"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
// prettier-ignore
function App() {
    var _a = useState({
        type: 'include',
        ids: new Set([1, 2, 'auto-generated-id-1']),
    }), rowSelectionModel = _a[0], setRowSelectionModel = _a[1];
    var _b = React.useState({
        type: 'include',
        ids: new Set([3, 4, 'auto-generated-id-7']),
    }), rowSelectionModel2 = _b[0], setRowSelectionModel2 = _b[1];
    var _c = React.useMemo(function () { return ({
        type: 'include',
        ids: new Set([5, 6, 'auto-generated-id-8']),
    }); }, []), rowSelectionModel3 = _c[0], setRowSelectionModel3 = _c[1];
    var _d = React.useMemo(function () { return [7, 8, 'auto-generated-id-9']; }, []), rowSelectionModel4 = _d[0], setRowSelectionModel4 = _d[1];
    return (<React.Fragment>
      <x_data_grid_1.DataGrid rowSelectionModel={rowSelectionModel} onRowSelectionModelChange={setRowSelectionModel}/>
      <x_data_grid_pro_1.DataGridPro rowSelectionModel={rowSelectionModel2} onRowSelectionModelChange={setRowSelectionModel2}/>
      <x_data_grid_premium_1.DataGridPremium rowSelectionModel={rowSelectionModel3} onRowSelectionModelChange={setRowSelectionModel3}/>
    </React.Fragment>);
}
exports.default = App;
