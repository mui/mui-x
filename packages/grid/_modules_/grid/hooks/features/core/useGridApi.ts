import * as React from 'react';
import { STATE_CHANGE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { GridApi } from '../../../models/api/gridApi';
import { StateChangeParams } from '../../../models/params/stateChangeParams';
import { isFunction } from '../../../utils/utils';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { getInitialState, GridState } from './gridState';

export const useGridApi = (apiRef: ApiRef): GridApi => {
  const logger = useLogger('useGridApi');
  const [state, forceUpdate] = React.useState<GridState>();
  if (!apiRef.current.isInitialised && !apiRef.current.state) {
    logger.info('Initialising state.');
    apiRef.current.state = getInitialState();
    apiRef.current.forceUpdate = forceUpdate;
  }

  const getState = React.useCallback(
    <State>(stateId?: string) =>
      (stateId ? apiRef.current.state[stateId] : apiRef.current.state) as State,
    [apiRef],
  );

  const onStateChange = React.useCallback(
    (handler: (param: StateChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(STATE_CHANGE, handler);
    },
    [apiRef],
  );

  const setState = React.useCallback(
    (stateOrFunc: GridState | ((oldState: GridState) => GridState)) => {
      let internalState: GridState;
      if (isFunction(stateOrFunc)) {
        internalState = stateOrFunc(apiRef.current.state);
      } else {
        internalState = stateOrFunc;
      }
      apiRef.current.state = {...internalState};
      forceUpdate(() => internalState);
      const params: StateChangeParams = { api: apiRef.current, state: internalState };
      apiRef.current.publishEvent(STATE_CHANGE, params);
    },
    [apiRef],
  );

  React.useEffect(()=> {
    if(apiRef && apiRef.current && apiRef.current.state) {
      // apiRef.current.state = state!;
    }
  }, [apiRef, state]);

  useApiMethod(apiRef, { getState, onStateChange, setState }, 'StateApi');

  return apiRef.current;
};
