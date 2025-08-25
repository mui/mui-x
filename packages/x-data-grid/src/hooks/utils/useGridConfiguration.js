"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridConfiguration = void 0;
var React = require("react");
var GridConfigurationContext_1 = require("../../components/GridConfigurationContext");
var useGridConfiguration = function () {
    var configuration = React.useContext(GridConfigurationContext_1.GridConfigurationContext);
    if (configuration === undefined) {
        throw new Error([
            'MUI X: Could not find the Data Grid configuration context.',
            'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
            'This can also happen if you are bundling multiple versions of the Data Grid.',
        ].join('\n'));
    }
    return configuration;
};
exports.useGridConfiguration = useGridConfiguration;
