import * as React from 'react';
import { GRID_STATE_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridStateChangeParams } from '../../../models/params/gridStateChangeParams';
import { isDeepEqual } from '../../../utils/utils';
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
        Object.keys(controlStateMap).forEach((stateId) => {
          const controlState = controlStateMap[stateId];
          const oldState = controlState.stateSelector(apiRef.current.state);
          const newSubState = controlState.stateSelector(newState);
          const hasSubStateChanged = !isDeepEqual(oldState, newSubState);

          if (updatedStateIds.length >= 1 && hasSubStateChanged) {
            // Each hook modify its own state and it should not leak
            // Events are here to forward to other hooks and apply changes.
            // You are trying to update several states in a no isolated way.
            throw new Error(
              `You're not allowed to update several sub-state in one transaction. You already updated ${updatedStateIds[0]}, therefore, you're not allowed to update ${controlState.stateId} in the same transaction.`,
            );
          }

          if (hasSubStateChanged) {
            if (controlState.propOnChange) {
              const newModel = controlState.mapStateToModel
                ? controlState.mapStateToModel(newSubState)
                : newSubState;

              if (!isDeepEqual(controlState.propModel, newModel)) {
                controlState.propOnChange(newModel);
                shouldUpdate = controlState.propModel === undefined;
              }
            } else if (!controlState.propOnChange && controlState.propModel !== undefined) {
              const oldModel = controlState.mapStateToModel
                ? controlState.mapStateToModel(oldState)
                : oldState;
              shouldUpdate = !isDeepEqual(oldModel, controlState.propModel);
            }
            if(shouldUpdate) {
              updatedStateIds.push(controlState.stateId);
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
        const params: GridStateChangeParams = { api: apiRef.current, state: newState };
        apiRef.current.publishEvent(GRID_STATE_CHANGE, params);

        updatedStateIds.forEach((stateId) => {
          if (controlStateMap[stateId].onChangeCallback) {
            const model = controlStateMap[stateId].mapStateToModel != null
              ? controlStateMap[stateId].mapStateToModel!(controlStateMap[stateId].stateSelector(newState))
              : controlStateMap[stateId].stateSelector(newState);
console.log('Calling onChange')
            controlStateMap[stateId].onChangeCallback!(model);
          }
        });
      }

      return hasChanged;
    },
    [apiRef],
  );
  return [apiRef.current.state, setGridState, forceUpdate];
};
