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
      let shouldUpdate = true;

      if(hasChanged && apiRef.current.controlStateRef) {
        const controlStateMap = apiRef.current.controlStateRef.current!;

        // We probably don't need to run all controlState here as
        // we only change stateModel one by one. But how can we identify which model as changed.
        // Should we check each state model with previous. Or should we do the following?
        Object.keys(controlStateMap).forEach(stateId => {
          const controlState = controlStateMap[stateId];
          const oldModel = controlState.stateSelector(apiRef.current.state);
          const newModel = controlState.stateSelector(newState);
          const hasControlledStateChange = oldModel !== newModel;
          if (hasControlledStateChange) {
            if ( controlState.propOnChange && controlState.propModel) {
              // when the prop model is set we won't change the state
              console.log(`State can't changed!`);
              controlState.propOnChange(newModel);
              shouldUpdate = false;
            }
            if(!controlState.propOnChange && controlState.propModel) {
              // we dont' change the state and just return false;
              shouldUpdate = false;
            }
            if( controlState.propOnChange && !controlState.propModel) {
              // if the prop model is not set, we call on change before setting the model.
              controlState.propOnChange(newModel);
            }
          }
          // What if the state was updated and multiple models changed?
          // Normally it should not happen as each hook modify its own state and it should not leak
          // Events are here to forwarded to other hooks to apply changes.
        });
      }
      if(!shouldUpdate) {
        return false;
      }

      if (hasChanged && apiRef.current.publishEvent) {
        const params: GridStateChangeParams = { api: apiRef.current, state: newState };
        apiRef.current.publishEvent(GRID_STATE_CHANGE, params);
      }
      // We always assign it as we mutate rows for perf reason.
      apiRef.current.state = newState;
      
      return hasChanged;
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
