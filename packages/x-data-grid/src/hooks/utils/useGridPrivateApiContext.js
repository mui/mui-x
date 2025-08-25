"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPrivateApiContext = void 0;
exports.useGridPrivateApiContext = useGridPrivateApiContext;
var React = require("react");
exports.GridPrivateApiContext = React.createContext(undefined);
function useGridPrivateApiContext() {
    var privateApiRef = React.useContext(exports.GridPrivateApiContext);
    if (privateApiRef === undefined) {
        throw new Error([
            'MUI X: Could not find the Data Grid private context.',
            'It looks like you rendered your component outside of a DataGrid, DataGridPro or DataGridPremium parent component.',
            'This can also happen if you are bundling multiple versions of the Data Grid.',
        ].join('\n'));
    }
    return privateApiRef;
}
