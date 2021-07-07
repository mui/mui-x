import React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridControlStateApi } from '../../../models/api/gridControlStateApi';
import { ControlStateItem } from '../../../models/controlStateItem';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export function useGridControlState(apiRef: GridApiRef) {
  const controlStateMapRef = React.useRef<Record<string, ControlStateItem<any>>>({});

  const updateControlState = React.useCallback((controlStateItem: ControlStateItem<any>) => {
    const { stateId, stateSelector, ...others } = controlStateItem;

    controlStateMapRef.current[stateId] = {
      ...others,
      stateId,
      stateSelector: !stateSelector ? (state) => state[stateId] : stateSelector,
    };
  }, []);

  const applyControlStateConstraint = React.useCallback(
    (newState) => {
      let shouldUpdate = true;
      const updatedStateIds: string[] = [];
      const controlStateMap = controlStateMapRef.current!;

      Object.keys(controlStateMap).forEach((stateId) => {
        const controlState = controlStateMap[stateId];
        const oldState = controlState.stateSelector(apiRef.current.state);
        const newSubState = controlState.stateSelector(newState);
        const hasSubStateChanged = oldState !== newSubState;

        if (updatedStateIds.length >= 1 && hasSubStateChanged) {
          // Each hook modify its own state and it should not leak
          // Events are here to forward to other hooks and apply changes.
          // You are trying to update several states in a no isolated way.
          // throw new Error(
          //   `You're not allowed to update several sub-state in one transaction. You already updated ${updatedStateIds[0]}, therefore, you're not allowed to update ${controlState.stateId} in the same transaction.`,
          // );
        }

        if (hasSubStateChanged) {
          if (controlState.propOnChange) {
            const newModel = newSubState;
            if (controlState.propModel !== newModel) {
              controlState.propOnChange(newModel);
            }
            shouldUpdate =
              controlState.propModel === undefined || controlState.propModel === newModel;
          } else if (controlState.propModel !== undefined) {
            shouldUpdate = oldState !== controlState.propModel;
          }
          if (shouldUpdate) {
            updatedStateIds.push(controlState.stateId);
          }
        }
      });

      return {
        shouldUpdate,
        postUpdate: () => {
          updatedStateIds.forEach((stateId) => {
            if (controlStateMap[stateId].onChangeCallback) {
              const model = controlStateMap[stateId].stateSelector(newState);
              controlStateMap[stateId].onChangeCallback!(model);
            }
          });
        },
      };
    },
    [apiRef],
  );

  const controlStateApi: GridControlStateApi = {
    updateControlState,
    applyControlStateConstraint,
  };
  useGridApiMethod(apiRef, controlStateApi, 'controlStateApi');
}
