import * as React from 'react';
import { GRID_STATE_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridApi } from '../../../models/api/gridApi';
import { GridStateChangeParams } from '../../../models/params/gridStateChangeParams';
import { isFunction } from '../../../utils/utils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { getInitialGridState, GridState } from './gridState';

export const useGridApi = (apiRef: GridApiRef): GridApi => {
  const logger = useLogger('useGridApi');
  const [, forceUpdate] = React.useState<GridState>();

  if (!apiRef.current.state) {
    logger.info('Initialising state.');
    apiRef.current.state = getInitialGridState();
    apiRef.current.forceUpdate = forceUpdate;
  }

  const getState = React.useCallback(
    <State>(stateId?: string) =>
      (stateId ? apiRef.current.state[stateId] : apiRef.current.state) as State,
    [apiRef],
  );

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
      const params: GridStateChangeParams = { api: apiRef.current, state };
      apiRef.current.publishEvent(GRID_STATE_CHANGE, params);
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { getState, setState }, 'GridStateApi');

  return apiRef.current;
};
