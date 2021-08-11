import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnInformationApi } from '../../../models/api/gridColumnApi';

import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';

export const useGridColumnInformation = (apiRef: GridApiRef): void => {
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const getColumn = React.useCallback<GridColumnInformationApi['getColumn']>(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns = React.useCallback<GridColumnInformationApi['getAllColumns']>(
    () => allColumns,
    [allColumns],
  );

  const getColumnsMeta = React.useCallback<GridColumnInformationApi['getColumnsMeta']>(
    () => columnsMeta,
    [columnsMeta],
  );

  const getColumnIndex = React.useCallback(
    (field: string, useVisibleColumns: boolean = true): number =>
      useVisibleColumns
        ? visibleColumns.findIndex((col) => col.field === field)
        : allColumns.findIndex((col) => col.field === field),
    [allColumns, visibleColumns],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return columnsMeta.positions[index];
    },
    [columnsMeta.positions, getColumnIndex],
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
