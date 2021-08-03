import * as React from 'react';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridVisibleColumnApi } from '../../../models/api/gridVisibleColumnApi';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GRID_COLUMN_VISIBILITY_CHANGE } from '../../../constants/eventsConstants';
import { useGridState } from '../core/useGridState';
import { visibleGridColumnsSelector } from './gridColumnsSelector';

export const useGridVisibleColumns = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onColumnVisibilityChange'>,
) => {
  const [, , forceUpdate] = useGridState(apiRef);

  const setColumnVisibility = React.useCallback(
    (field: string, isVisible: boolean) => {
      const col = apiRef.current.getColumn(field);
      const updatedCol = { ...col, hide: !isVisible };

      apiRef.current.updateColumns([updatedCol]);
      forceUpdate();

      apiRef.current.publishEvent(GRID_COLUMN_VISIBILITY_CHANGE, {
        field,
        colDef: updatedCol,
        api: apiRef,
        isVisible,
      });
    },
    [apiRef, forceUpdate],
  );

  const getVisibleColumns = React.useCallback(
    () => visibleGridColumnsSelector(apiRef.current.getState()),
    [apiRef],
  );

  const visibleColumnsApi: GridVisibleColumnApi = {
    getVisibleColumns,
    setColumnVisibility,
  };

  useGridApiMethod(apiRef, visibleColumnsApi, 'GridVisibleColumnsApi');

  useGridApiOptionHandler(apiRef, GRID_COLUMN_VISIBILITY_CHANGE, props.onColumnVisibilityChange);
};
