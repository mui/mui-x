import * as React from 'react';
import { gridRowIdSelector, GridParamsApi } from '@mui/x-data-grid-pro';
import { useGridParamsOverridableMethods as useGridParamsOverridableMethodsCommunity } from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import { gridCellAggregationResultSelector } from '../aggregation/gridAggregationSelectors';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export const useGridParamsOverridableMethods = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const communityMethods = useGridParamsOverridableMethodsCommunity(apiRef);

  const getCellValue = React.useCallback<GridParamsApi['getCellValue']>(
    (id, field) =>
      gridCellAggregationResultSelector(apiRef, {
        id,
        field,
      })?.value ?? communityMethods.getCellValue(id, field),
    [apiRef, communityMethods],
  );

  const getRowValue = React.useCallback<GridParamsApi['getRowValue']>(
    (row, colDef) =>
      gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef.field,
      })?.value ?? communityMethods.getRowValue(row, colDef),
    [apiRef, communityMethods],
  );

  const getRowFormattedValue = React.useCallback<GridParamsApi['getRowFormattedValue']>(
    (row, colDef) =>
      gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef.field,
      })?.formattedValue ?? communityMethods.getRowFormattedValue(row, colDef),
    [apiRef, communityMethods],
  );

  return {
    getCellValue,
    getRowValue,
    getRowFormattedValue,
  };
};
