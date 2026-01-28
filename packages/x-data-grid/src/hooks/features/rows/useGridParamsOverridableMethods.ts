import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { getRowValue as getRowValueFn } from './gridRowsUtils';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridParamsApi } from '../../../models/api/gridParamsApi';

export const useGridParamsOverridableMethods = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const getCellValue = React.useCallback<GridParamsApi['getCellValue']>(
    (id, field) => {
      const colDef = apiRef.current.getColumn(field);

      const row = apiRef.current.getRow(id);
      if (!row) {
        throw new Error(`No row with id #${id} found`);
      }

      if (!colDef || !colDef.valueGetter) {
        return row[field];
      }

      return colDef.valueGetter(row[colDef.field] as never, row, colDef, apiRef);
    },
    [apiRef],
  );

  const getRowValue = React.useCallback<GridParamsApi['getRowValue']>(
    (row, colDef) => getRowValueFn(row, colDef, apiRef),
    [apiRef],
  );

  const getRowFormattedValue = React.useCallback<GridParamsApi['getRowFormattedValue']>(
    (row, colDef) => {
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
