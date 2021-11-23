import * as React from 'react';
import { GridEvents } from '../../constants/eventsConstants';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';
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
      if (apiRef.current.state === newState) {
        return false;
      }

      const { ignoreSetState, postUpdate } =
        apiRef.current.unstable_applyControlStateConstraint(newState);

      if (!ignoreSetState) {
        // We always assign it as we mutate rows for perf reason.
        apiRef.current.state = newState;

        if (apiRef.current.publishEvent) {
          apiRef.current.publishEvent(GridEvents.stateChange, newState);
        }
      }

      postUpdate();

      return !ignoreSetState;
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
