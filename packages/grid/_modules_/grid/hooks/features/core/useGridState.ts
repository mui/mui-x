import * as React from 'react';
import { GRID_STATE_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridStateChangeParams } from '../../../models/params/gridStateChangeParams';
import { GridState } from './gridState';
import { useGridApi } from './useGridApi';

export const useGridState = (
  apiRef: GridApiRef,
): [GridState, (stateUpdaterFn: (oldState: GridState) => GridState) => boolean, () => void] => {
  useGridApi(apiRef);

  const forceUpdate = React.useCallback(
    () => apiRef.current.forceUpdate(() => apiRef.current.state),
    [apiRef],
  );

  const setGridState = React.useCallback(
    (stateUpdaterFn: (oldState: GridState) => GridState) => {
      const newState = stateUpdaterFn(apiRef.current.state);
      const hasChanged = apiRef.current.state !== newState;
      if (!hasChanged) {
        // We always assign it as we mutate rows for perf reason.
        apiRef.current.state = newState;
        return false;
      }

      const { shouldUpdate, postUpdate } = apiRef.current.applyControlStateConstraint(newState);

      if (!shouldUpdate) {
        return false;
      }
      // We always assign it as we mutate rows for perf reason.
      apiRef.current.state = newState;

      if (hasChanged && apiRef.current.publishEvent) {
        const params: GridStateChangeParams = { api: apiRef.current, state: newState };
        apiRef.current.publishEvent(GRID_STATE_CHANGE, params);

        postUpdate();
      }

      return hasChanged;
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
