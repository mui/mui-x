import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridApi } from '../../../models/api/gridApi';
import { isFunction } from '../../../utils/utils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridState } from './gridState';

export const useGridApi = (apiRef: GridApiRef): GridApi => {
  const logger = useGridLogger(apiRef, 'useGridApi');
  const [, forceUpdate] = React.useState<GridState>();

  if (!apiRef.current.state) {
    logger.info('Initialising state.');
    apiRef.current.state = {} as GridState;
    apiRef.current.forceUpdate = forceUpdate;
  }

  const getState = React.useCallback(() => apiRef.current.state, [apiRef]);

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

  useGridApiMethod(apiRef, { getState, setState }, 'GridStateApi');

  return apiRef.current;
};
