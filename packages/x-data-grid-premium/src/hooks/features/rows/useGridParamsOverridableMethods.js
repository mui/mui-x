import * as React from 'react';
import { gridRowIdSelector } from '@mui/x-data-grid-pro';
import { useGridParamsOverridableMethods as useGridParamsOverridableMethodsCommunity } from '@mui/x-data-grid-pro/internals';
import { gridCellAggregationResultSelector } from '../aggregation/gridAggregationSelectors';
export const useGridParamsOverridableMethods = (apiRef) => {
    const communityMethods = useGridParamsOverridableMethodsCommunity(apiRef);
    const getCellValue = React.useCallback((id, field) => gridCellAggregationResultSelector(apiRef, {
        id,
        field,
    })?.value ?? communityMethods.getCellValue(id, field), [apiRef, communityMethods]);
    const getRowValue = React.useCallback((row, colDef) => gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef.field,
    })?.value ?? communityMethods.getRowValue(row, colDef), [apiRef, communityMethods]);
    const getRowFormattedValue = React.useCallback((row, colDef) => {
        const aggregationFormattedValue = gridCellAggregationResultSelector(apiRef, {
            id: gridRowIdSelector(apiRef, row),
            field: colDef.field,
        })?.formattedValue;
        if (aggregationFormattedValue !== undefined) {
            return aggregationFormattedValue;
        }
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
