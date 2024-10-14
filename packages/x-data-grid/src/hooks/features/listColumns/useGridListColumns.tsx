import * as React from 'react';
import type { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridListColumnApi } from '../../../models/api/gridListColumnApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridEventListener } from '../../../models/events';
import {
  gridListColumnSelector,
  gridVisibleListColumnDefinitionsSelector,
} from './gridListColumnsSelector';
import { gridColumnDefinitionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns';
import { gridDimensionsSelector } from '../dimensions';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

export type GridListColumnState = GridStateColDef | undefined;

const getListColumnWidth = (apiRef: React.MutableRefObject<GridPrivateApiCommunity>) => {
  const dimensions = gridDimensionsSelector(apiRef.current.state);
  const columns = gridVisibleColumnDefinitionsSelector(apiRef);
  const actionsColumn = columns.find((col) => col.type === 'actions');
  const viewportWidth = dimensions.viewportInnerSize.width;
  const listColumnWidth = actionsColumn
    ? viewportWidth - actionsColumn.computedWidth
    : viewportWidth;
  return listColumnWidth;
};

export const listColumnStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'unstable_listColumn'>
> = (state, props, apiRef) => ({
  ...state,
  listColumn: { ...props.unstable_listColumn, computedWidth: getListColumnWidth(apiRef) },
});

export function useGridListColumn(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_listColumn'>,
) {
  /**
   * API METHODS
   */
  const getListColumn = React.useCallback<GridListColumnApi['getListColumn']>(
    (field) => {
      const listColumn = gridListColumnSelector(apiRef.current.state);
      if (listColumn?.field === field) {
        return listColumn;
      }

      const columns = gridColumnDefinitionsSelector(apiRef);
      return columns.find((col) => col.field === field && col.type === 'actions');
    },
    [apiRef],
  );

  const getListColumnIndex = React.useCallback<GridListColumnApi['getListColumnIndex']>(
    (field) => {
      const columns = gridVisibleListColumnDefinitionsSelector(apiRef);
      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const listColumnApi: GridListColumnApi = {
    getListColumn,
    getListColumnIndex,
  };

  useGridApiMethod(apiRef, listColumnApi, 'private');

  /*
   * EVENTS
   */
  const prevInnerWidth = React.useRef<number | null>(null);
  const handleGridSizeChange: GridEventListener<'viewportInnerSizeChange'> = (
    viewportInnerSize,
  ) => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      apiRef.current.setState((state) => {
        return {
          ...state,
          listColumn: {
            ...state.listColumn,
            computedWidth: getListColumnWidth(apiRef),
          } as GridListColumnState,
        };
      });
    }
  };

  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_listColumn) {
      apiRef.current.setState((state) => {
        return {
          ...state,
          listColumn: {
            ...props.unstable_listColumn,
            computedWidth: getListColumnWidth(apiRef),
          } as GridListColumnState,
        };
      });
    }
  }, [apiRef, props.unstable_listColumn]);
}
