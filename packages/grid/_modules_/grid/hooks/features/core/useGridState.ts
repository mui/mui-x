import * as React from 'react';
import { STATE_CHANGE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { StateChangeParams } from '../../../models/params/stateChangeParams';
import { GridState } from './gridState';
import { useGridApi } from './useGridApi';

function deepFreeze(o) {
  Object.freeze(o);
  if (o === undefined) {
    return o;
  }

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

export const useGridState = (
  apiRef: ApiRef,
): [GridState, (stateUpdaterFn: (oldState: GridState) => GridState) => void, () => void] => {
  useGridApi(apiRef);
  const forceUpdate = React.useCallback(
    () => apiRef.current.forceUpdate(() => apiRef.current.state),
    [apiRef],
  );
  const setGridState = React.useCallback(
    (stateUpdaterFn: (oldState: GridState) => GridState) => {
      const newState = stateUpdaterFn(apiRef.current.state);
      const hasChanged = apiRef.current.state !== newState;

      // We always assign it as we mutate rows for perf reason.
      apiRef.current.state = newState;
      deepFreeze(newState);

      if (hasChanged && apiRef.current.publishEvent) {
        const params: StateChangeParams = { api: apiRef.current, state: newState };
        apiRef.current.publishEvent(STATE_CHANGE, params);
      }
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
