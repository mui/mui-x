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
      const updatedStateIds: string[] = [];
      const controlStateMap = apiRef.current.controlStateRef.current!;

      if (hasChanged && apiRef.current.controlStateRef) {
        Object.keys(controlStateMap).forEach(stateId => {
          const controlState = controlStateMap[stateId];
          const oldState = controlState.stateSelector(apiRef.current.state);
          const newSubState = controlState.stateSelector(newState);
          const hasSubStateChanged = oldState !== newState;

          if (updatedStateIds.length >= 1 && hasSubStateChanged) {
            // What if the state was updated and multiple models changed?
            // Normally it should not happen as each hook modify its own state and it should not leak
            // Events are here to forwarded to other hooks to apply changes.
            // You are trying to update several states in a not isolated way.
            throw new Error(`You're not allowed to update several substate in one transaction. You already updated ${updatedStateIds[0]}, therefore, you're not allowed to update ${controlState.stateId} in the same transaction.`);
          }

          if (hasSubStateChanged) {
            updatedStateIds.push(controlState.stateId);

            if (controlState.propOnChange && controlState.propModel) {
              // when the prop model is set we won't change the state
              // it is down to the onChange to update the model. We just pass it the new model as arg
              controlState.propOnChange(newSubState); //TODO convert state to model
              shouldUpdate = false;
            }
            if (!controlState.propOnChange && controlState.propModel) {
              // we dont' change the state and just return false;
              // how to apply propModel
              console.log(newState)
              console.log(controlState.propModel)
              // TODO fix  issue with selection state as the model is different of the state.
              shouldUpdate = newState === controlState.propModel;
            }
            if (controlState.propOnChange && !controlState.propModel) {
              // if the prop model is not set, we call on change before setting the model.
              // So if one mutate the model in onchange then we update it in the state
              controlState.propOnChange(newState);
            }
          }

        });
      }
      if (!shouldUpdate) {
        return false;
      }
      // We always assign it as we mutate rows for perf reason.
      apiRef.current.state = newState;

      if (hasChanged && apiRef.current.publishEvent) {
        const params: GridStateChangeParams = {api: apiRef.current, state: newState};
        apiRef.current.publishEvent(GRID_STATE_CHANGE, params);

        updatedStateIds.forEach(stateId => {
          if (controlStateMap[stateId].onChangeCallback) {
            //TODO here you need to add the latest model that you can get from the array
            // this is meant to publish the onchange event
            controlStateMap[stateId].onChangeCallback!()
          }
        });
      }

      return hasChanged;
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
