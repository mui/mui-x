import * as React from 'react';
import { gridRowIdSelector } from '@mui/x-data-grid-pro';
import type { GridParamsApi } from '@mui/x-data-grid-pro';
import { useGridParamsOverridableMethods as useGridParamsOverridableMethodsCommunity } from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import { gridCellAggregationResultSelector } from '../aggregation/gridAggregationSelectors';
import { gridCellFormulaResultSelector } from '../formula/gridFormulaSelectors';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export const useGridParamsOverridableMethods = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const communityMethods = useGridParamsOverridableMethodsCommunity(apiRef);

  const getCellValue = React.useCallback<GridParamsApi['getCellValue']>(
    (id, field) => {
      const aggregationValue = gridCellAggregationResultSelector(apiRef, { id, field })?.value;
      if (aggregationValue != null) {
        return aggregationValue;
      }
      // Membership check, not value truthiness: a formula evaluating to `null`
      // must still mask the raw `=` source.
      const formulaResult = gridCellFormulaResultSelector(apiRef, { id, field });
      if (formulaResult != null) {
        return formulaResult.type === 'error' ? formulaResult.code : formulaResult.value;
      }
      return communityMethods.getCellValue(id, field);
    },
    [apiRef, communityMethods],
  );

  const getRowValue = React.useCallback<GridParamsApi['getRowValue']>(
    (row, colDef) => {
      const id = gridRowIdSelector(apiRef, row);
      const aggregationValue = gridCellAggregationResultSelector(apiRef, {
        id,
        field: colDef?.field,
      })?.value;
      if (aggregationValue != null) {
        return aggregationValue;
      }
      const formulaResult = gridCellFormulaResultSelector(apiRef, { id, field: colDef?.field });
      if (formulaResult != null) {
        return formulaResult.type === 'error' ? formulaResult.code : formulaResult.value;
      }
      return communityMethods.getRowValue(row, colDef);
    },
    [apiRef, communityMethods],
  );

  const getRowFormattedValue = React.useCallback<GridParamsApi['getRowFormattedValue']>(
    (row, colDef) => {
      const aggregationFormattedValue = gridCellAggregationResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef?.field,
      })?.formattedValue;

      if (aggregationFormattedValue !== undefined) {
        return aggregationFormattedValue;
      }

      const formulaResult = gridCellFormulaResultSelector(apiRef, {
        id: gridRowIdSelector(apiRef, row),
        field: colDef?.field,
      });
      if (formulaResult?.type === 'error') {
        // Error codes are the user-visible representation — they bypass the
        // column `valueFormatter`. Value results flow through it normally.
        return formulaResult.code;
      }

      const value = getRowValue(row, colDef);

      if (!colDef || !colDef.valueFormatter) {
        return value;
      }

      return colDef.valueFormatter(value as never, row, colDef, apiRef);
    },
    [apiRef, getRowValue],
  );

  return {
    getCellValue,
    getRowValue,
    getRowFormattedValue,
  };
};
