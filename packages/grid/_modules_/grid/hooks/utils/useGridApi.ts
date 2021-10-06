import * as React from 'react';
import { GridEvents } from '../../constants/eventsConstants';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { isFunction } from '../../utils/utils';
import { useGridApiMethod } from './useGridApiMethod';
import { useGridLogger } from './useGridLogger';
import { GridState } from '../../models/gridState';
import { getInitialGridColumnReorderState } from '../features/columnReorder/columnReorderState';
import { getInitialGridColumnResizeState } from '../features/columnResize/columnResizeState';
import { getInitialGridDensityState } from '../features/density/densityState';
import { getInitialGridFilterState } from '../features/filter/gridFilterModelState';
import { getInitialGridRenderingState } from '../features/virtualization/renderingState';
import { getInitialGridRowState } from '../features/rows/gridRowsState';
import { getInitialGridSortingState } from '../features/sorting/gridSortingState';
import { getInitialPaginationState } from '../features/pagination/gridPaginationState';
import { getInitialVisibleGridRowsState } from '../features/filter/visibleGridRowsState';
import { getInitialGridColumnsState } from '../../models/colDef/gridColDef';

const getInitialGridState = (): GridState => ({
  rows: getInitialGridRowState(),
  editRows: {},
  pagination: getInitialPaginationState(),
  columns: getInitialGridColumnsState(),
  columnReorder: getInitialGridColumnReorderState(),
  columnResize: getInitialGridColumnResizeState(),
  rendering: getInitialGridRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, sizes: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialGridSortingState(),
  focus: { cell: null, columnHeader: null },
  tabIndex: { cell: null, columnHeader: null },
  selection: [],
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialGridDensityState(),
});

export const useGridApi = (apiRef: GridApiRef): GridApi => {
  const logger = useGridLogger(apiRef, 'useGridApi');
  const [, forceUpdate] = React.useState<GridState>();

  if (!apiRef.current.state) {
    logger.info('Initialising state.');
    apiRef.current.state = getInitialGridState();
    apiRef.current.forceUpdate = forceUpdate;
  }

  const setState = React.useCallback(
    (stateOrFunc: GridState | ((oldState: GridState) => GridState)) => {
      let state: GridState;
      if (isFunction(stateOrFunc)) {
        state = stateOrFunc(apiRef.current.state);
      } else {
        state = stateOrFunc;
      }
      apiRef.current.state = state;
      forceUpdate(() => state);
      apiRef.current.publishEvent(GridEvents.stateChange, state);
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { setState }, 'GridStateApi');

  return apiRef.current;
};
