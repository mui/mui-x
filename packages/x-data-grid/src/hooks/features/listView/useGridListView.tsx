import * as React from 'react';
import type { GridListColDef } from '../../../models/colDef/gridColDef';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridEventListener } from '../../../models/events';
import { gridDimensionsSelector } from '../dimensions';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';

export type GridListViewState = (GridListColDef & { computedWidth: number }) | undefined;

export const listViewStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'unstable_listColumn'>
> = (state, props, apiRef) => ({
  ...state,
  listViewColumn: { ...props.unstable_listColumn, computedWidth: getListColumnWidth(apiRef) },
});

export function useGridListView(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_listColumn'>,
) {
  /*
   * EVENTS
   */
  const updateListColumnWidth = () => {
    apiRef.current.setState((state) => {
      if (!state.listViewColumn) {
        return state;
      }
      return {
        ...state,
        listViewColumn: {
          ...state.listViewColumn,
          computedWidth: getListColumnWidth(apiRef),
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
          listViewColumn: {
            ...listColumn,
            computedWidth: getListColumnWidth(apiRef),
          },
        };
      });
    }
  }, [apiRef, props.unstable_listColumn]);
}

function getListColumnWidth(apiRef: React.MutableRefObject<GridPrivateApiCommunity>) {
  return gridDimensionsSelector(apiRef.current.state).viewportInnerSize.width;
}
