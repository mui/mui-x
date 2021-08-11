import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnInformationApi } from '../../../models/api/gridColumnApi';

import { useGridApiMethod } from '../../root/useGridApiMethod';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';

export const useGridColumnInformation = (apiRef: GridApiRef): void => {
  const getColumn = React.useCallback<GridColumnInformationApi['getColumn']>(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns = React.useCallback<GridColumnInformationApi['getAllColumns']>(
    () => allGridColumnsSelector(apiRef.current.state),
    [apiRef],
  );

  const getColumnsMeta = React.useCallback<GridColumnInformationApi['getColumnsMeta']>(
    () => gridColumnsMetaSelector(apiRef.current.state),
    [apiRef],
  );

  const getColumnIndex = React.useCallback<GridColumnInformationApi['getColumnIndex']>(
    (field: string, useVisibleColumns: boolean = true): number => {
      const columns = useVisibleColumns
        ? visibleGridColumnsSelector(apiRef.current.state)
        : allGridColumnsSelector(apiRef.current.state);
      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return gridColumnsMetaSelector(apiRef.current.state).positions[index];
    },
    [apiRef, getColumnIndex],
  );

  const colApi: GridColumnInformationApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getColumnsMeta,
  };

  useGridApiMethod(apiRef, colApi, 'ColInformationApi');
};
