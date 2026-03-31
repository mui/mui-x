import * as React from 'react';
import { getRowValue as getRowValueFn } from './gridRowsUtils';
export const useGridParamsOverridableMethods = (apiRef) => {
    const getCellValue = React.useCallback((id, field) => {
        const colDef = apiRef.current.getColumn(field);
        const row = apiRef.current.getRow(id);
        if (!row) {
            throw new Error(`MUI X: No row with id #${id} found`);
        }
        if (!colDef || !colDef.valueGetter) {
            return row[field];
        }
        return colDef.valueGetter(row[colDef.field], row, colDef, apiRef);
    }, [apiRef]);
    const getRowValue = React.useCallback((row, colDef) => getRowValueFn(row, colDef, apiRef), [apiRef]);
    const getRowFormattedValue = React.useCallback((row, colDef) => {
        const value = getRowValue(row, colDef);
        if (!colDef || !colDef.valueFormatter) {
            return value;
        }
        return colDef.valueFormatter(value, row, colDef, apiRef);
    }, [apiRef, getRowValue]);
    return {
        getCellValue,
        getRowValue,
        getRowFormattedValue,
    };
};
