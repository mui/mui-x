"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridChartsIntegrationContext = void 0;
var React = require("react");
var GridChartsIntegrationContext_1 = require("../../components/chartsIntegration/GridChartsIntegrationContext");
var useGridChartsIntegrationContext = function (ignoreError) {
    if (ignoreError === void 0) { ignoreError = false; }
    var context = React.useContext(GridChartsIntegrationContext_1.GridChartsIntegrationContext);
    if (!context && !ignoreError) {
        throw new Error([
            'MUI X: Could not find the Data Grid charts integration context.',
            'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
            'This can also happen if you are bundling multiple versions of the Data Grid.',
        ].join('\n'));
    }
    return context;
};
exports.useGridChartsIntegrationContext = useGridChartsIntegrationContext;
