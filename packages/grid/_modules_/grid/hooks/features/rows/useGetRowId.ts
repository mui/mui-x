import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { RowData, RowIdGetter } from '../../../models/rows';
import { useApiMethod } from '../../root/useApiMethod';

const getDefaultRowId = (row: RowData) => row.id;

export const useGetRowId = (apiRef: ApiRef, getRowIdProp?: RowIdGetter) => {
  const getRowId = React.useCallback(
    (row: RowData) => {
      if (getRowIdProp != null) {
        return getRowIdProp(row);
      }
      return getDefaultRowId(row);
    },
    [getRowIdProp],
  );

  useApiMethod(apiRef, { getRowId }, 'RowIdApi');
};
