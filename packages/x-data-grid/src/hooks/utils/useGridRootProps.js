"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRootProps = void 0;
var React = require("react");
var GridRootPropsContext_1 = require("../../context/GridRootPropsContext");
var useGridRootProps = function () {
    var contextValue = React.useContext(GridRootPropsContext_1.GridRootPropsContext);
    if (!contextValue) {
        throw new Error('MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.');
    }
    return contextValue;
};
exports.useGridRootProps = useGridRootProps;
