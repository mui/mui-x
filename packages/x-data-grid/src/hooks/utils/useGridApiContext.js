"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridApiContext = useGridApiContext;
var React = require("react");
var GridApiContext_1 = require("../../components/GridApiContext");
function useGridApiContext() {
    var apiRef = React.useContext(GridApiContext_1.GridApiContext);
    if (apiRef === undefined) {
        throw new Error([
            'MUI X: Could not find the Data Grid context.',
            'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
            'This can also happen if you are bundling multiple versions of the Data Grid.',
        ].join('\n'));
    }
    return apiRef;
}
