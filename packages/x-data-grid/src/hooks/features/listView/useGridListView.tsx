import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import type { GridListViewColDef } from '../../../models/colDef/gridColDef';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridEventListener } from '../../../models/events';
import { gridDimensionsSelector } from '../dimensions';
import { useGridEvent } from '../../utils/useGridEvent';

export type GridListViewState = (GridListViewColDef & { computedWidth: number }) | undefined;

export const listViewStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'listViewColumn'>
> = (state, props, apiRef) => ({
  ...state,
  listViewColumn: props.listViewColumn
    ? { ...props.listViewColumn, computedWidth: getListColumnWidth(apiRef) }
    : undefined,
});

export function useGridListView(
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'listView' | 'listViewColumn'>,
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

  useGridEvent(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
  useGridEvent(apiRef, 'columnVisibilityModelChange', updateListColumnWidth);

  /*
   * EFFECTS
   */
  useEnhancedEffect(() => {
    const listColumn = props.listViewColumn;
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
  }, [apiRef, props.listViewColumn]);

  React.useEffect(() => {
    if (props.listView && !props.listViewColumn) {
      warnOnce([
        'MUI X: The `listViewColumn` prop must be set if `listView` is enabled.',
        'To fix, pass a column definition to the `listViewColumn` prop, e.g. `{ field: "example", renderCell: (params) => <div>{params.row.id}</div> }`.',
        'For more details, see https://mui.com/x/react-data-grid/list-view/',
      ]);
    }
  }, [props.listView, props.listViewColumn]);
}

function getListColumnWidth(apiRef: RefObject<GridPrivateApiCommunity>) {
  return gridDimensionsSelector(apiRef).viewportInnerSize.width;
}
