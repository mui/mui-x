'use client';
import * as React from 'react';
export const GridPrivateApiContext = React.createContext(undefined);
export function useGridPrivateApiContext() {
    const privateApiRef = React.useContext(GridPrivateApiContext);
    if (privateApiRef === undefined) {
        throw new Error('MUI X Data Grid: Could not find the Data Grid private context. ' +
            'This happens when a component is rendered outside of a DataGrid, DataGridPro, or DataGridPremium parent component. ' +
            'Ensure your component is a child of a Data Grid component. ' +
            'This can also happen if you are bundling multiple versions of the Data Grid.');
    }
    return privateApiRef;
}
