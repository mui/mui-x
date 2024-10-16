import * as React from 'react';
import type { GridListColDef } from '../../../models/colDef/gridColDef';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridListViewApi } from '../../../models/api/gridListViewApi';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridEventListener } from '../../../models/events';
import { gridVisibleListColumnDefinitionsSelector } from './gridListViewSelectors';
import { gridVisibleColumnDefinitionsSelector } from '../columns';
import { gridDimensionsSelector } from '../dimensions';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

export type GridListViewState = {
  listColumn: (GridListColDef & { computedWidth: number }) | undefined;
};

export const listViewStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'unstable_listColumn'>
> = (state, props, apiRef) => ({
  ...state,
  listView: {
    listColumn: { ...props.unstable_listColumn, computedWidth: getListColumnWidth(apiRef) },
  },
});

export function useGridListView(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_listColumn'>,
) {
  /*
   * API METHODS
   */
  const getListColumn: GridListViewApi['unstable_getListColumn'] = (field) => {
    const columns = gridVisibleListColumnDefinitionsSelector(apiRef);
    return columns.find((col) => col.field === field);
  };

  const getListColumnIndex: GridListViewApi['unstable_getListColumnIndex'] = (field) => {
    const columns = gridVisibleListColumnDefinitionsSelector(apiRef);
    return columns.findIndex((col) => col.field === field);
  };

  const listColumnApi: GridListViewApi = {
    unstable_getListColumn: getListColumn,
    unstable_getListColumnIndex: getListColumnIndex,
  };

  useGridApiMethod(apiRef, listColumnApi, 'private');

  /*
   * EVENTS
   */
  const updateListColumnWidth = () => {
    apiRef.current.setState((state) => {
      if (!state.listView.listColumn) {
        return state;
      }
      return {
        ...state,
        listView: {
          ...state.listView,
          listColumn: {
            ...state.listView.listColumn,
            computedWidth: getListColumnWidth(apiRef),
          },
        },
      };
    });
  };

  const prevInnerWidth = React.useRef<number | null>(null);
  const handleGridSizeChange: GridEventListener<'viewportInnerSizeChange'> = (
    viewportInnerSize,
  ) => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      updateListColumnWidth();
    }
  };

  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
  useGridApiEventHandler(apiRef, 'columnVisibilityModelChange', updateListColumnWidth);

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    const listColumn = props.unstable_listColumn;
    if (listColumn) {
      apiRef.current.setState((state) => {
        return {
          ...state,
          listView: {
            ...state.listView,
            listColumn: {
              ...listColumn,
              computedWidth: getListColumnWidth(apiRef),
            },
          },
        };
      });
    }
  }, [apiRef, props.unstable_listColumn]);
}

function getListColumnWidth(apiRef: React.MutableRefObject<GridPrivateApiCommunity>) {
  const dimensions = gridDimensionsSelector(apiRef.current.state);
  const columns = gridVisibleColumnDefinitionsSelector(apiRef);
  const actionsColumn = columns.find((col) => col.type === 'actions');
  const viewportWidth = dimensions.viewportInnerSize.width;
  const listColumnWidth =
    actionsColumn && actionsColumn ? viewportWidth - actionsColumn.computedWidth : viewportWidth;
  return listColumnWidth;
}
