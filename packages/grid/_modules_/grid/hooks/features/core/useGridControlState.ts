import React from 'react';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridControlStateApi } from '../../../models/api/gridControlStateApi';
import { GridControlStateItem } from '../../../models/controlStateItem';
import { GridSignature } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export function useGridControlState(apiRef: GridApiRef, props: GridComponentProps) {
  const controlStateMapRef = React.useRef<Record<string, GridControlStateItem<any>>>({});

  const updateControlState = React.useCallback((controlStateItem: GridControlStateItem<any>) => {
    const { stateId, stateSelector, ...others } = controlStateItem;

    controlStateMapRef.current[stateId] = {
      ...others,
      stateId,
      stateSelector: !stateSelector ? (state) => state[stateId] : stateSelector,
    };
  }, []);

  const applyControlStateConstraint = React.useCallback(
    (newState) => {
      let ignoreSetState = false;
      const updatedStateIds: string[] = [];
      const controlStateMap = controlStateMapRef.current!;

      Object.keys(controlStateMap).forEach((stateId) => {
        const controlState = controlStateMap[stateId];
        const oldState = controlState.stateSelector(apiRef.current.state);
        const newSubState = controlState.stateSelector(newState);

        // TODO newSubState !== controlState.propModel shouldn't be necessary
        // but we need it for the initial state.
        if (newSubState !== oldState && newSubState !== controlState.propModel) {
          updatedStateIds.push(controlState.stateId);
        }

        // The state is controlled, the prop should always win
        if (controlState.propModel !== undefined && newSubState !== controlState.propModel) {
          ignoreSetState = true;
        }
      });

      if (updatedStateIds.length > 1) {
        // Each hook modify its own state and it should not leak
        // Events are here to forward to other hooks and apply changes.
        // You are trying to update several states in a no isolated way.
        throw new Error(
          `You're not allowed to update several sub-state in one transaction. You already updated ${
            updatedStateIds[0]
          }, therefore, you're not allowed to update ${updatedStateIds.join(
            ', ',
          )} in the same transaction.`,
        );
      }

      return {
        ignoreSetState,
        postUpdate: () => {
          updatedStateIds.forEach((stateId) => {
            const controlState = controlStateMap[stateId];
            const model = controlStateMap[stateId].stateSelector(newState);

            if (controlState.propOnChange) {
              const details =
                props.signature === GridSignature.DataGridPro ? { api: apiRef.current } : {};
              controlState.propOnChange(model, details);
            }

            apiRef.current.publishEvent(controlState.changeEvent, model);
          });
        },
      };
    },
    [apiRef, props.signature],
  );

  const controlStateApi: GridControlStateApi = {
    updateControlState,
    applyControlStateConstraint,
  };
  useGridApiMethod(apiRef, controlStateApi, 'controlStateApi');
}
