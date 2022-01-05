import React from 'react';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridStateApi } from '../../models/api/gridStateApi';
import { GridControlStateItem } from '../../models/controlStateItem';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { GridState } from '../../models/gridState';
import { GridEvents } from '../../models/events';
import { useGridApiMethod } from '../utils';

export const useGridStateInitialization = (apiRef: GridApiRef, props: DataGridProcessedProps) => {
  const controlStateMapRef = React.useRef<Record<string, GridControlStateItem<any>>>({});
  const [, rawForceUpdate] = React.useState<GridState>();

  const updateControlState = React.useCallback<GridStateApi['unstable_updateControlState']>(
    (controlStateItem) => {
      const { stateId, ...others } = controlStateItem;

      controlStateMapRef.current[stateId] = {
        ...others,
        stateId,
      };
    },
    [],
  );

  const setState = React.useCallback<GridStateApi['setState']>(
    (state) => {
      let newState: GridState;
      if (typeof state === 'function') {
        newState = state(apiRef.current.state);
      } else {
        newState = state;
      }

      if (apiRef.current.state === newState) {
        return false;
      }

      let ignoreSetState = false;

      // Apply the control state constraints
      const updatedControlStateIds: { stateId: string; hasPropChanged: boolean }[] = [];
      Object.keys(controlStateMapRef.current).forEach((stateId) => {
        const controlState = controlStateMapRef.current[stateId];
        const oldSubState = controlState.stateSelector(apiRef.current.state);
        const newSubState = controlState.stateSelector(newState);

        if (newSubState === oldSubState) {
          return;
        }

        updatedControlStateIds.push({
          stateId: controlState.stateId,
          hasPropChanged: newSubState !== controlState.propModel,
        });

        // The state is controlled, the prop should always win
        if (controlState.propModel !== undefined && newSubState !== controlState.propModel) {
          ignoreSetState = true;
        }
      });

      if (updatedControlStateIds.length > 1) {
        // Each hook modify its own state, and it should not leak
        // Events are here to forward to other hooks and apply changes.
        // You are trying to update several states in a no isolated way.
        throw new Error(
          `You're not allowed to update several sub-state in one transaction. You already updated ${
            updatedControlStateIds[0]
          }, therefore, you're not allowed to update ${updatedControlStateIds.join(
            ', ',
          )} in the same transaction.`,
        );
      }

      if (!ignoreSetState) {
        // We always assign it as we mutate rows for perf reason.
        apiRef.current.state = newState;

        if (apiRef.current.publishEvent) {
          apiRef.current.publishEvent(GridEvents.stateChange, newState);
        }
      }

      updatedControlStateIds.forEach(({ stateId, hasPropChanged }) => {
        const controlState = controlStateMapRef.current[stateId];
        const model = controlState.stateSelector(newState);

        if (controlState.propOnChange && hasPropChanged) {
          const details =
            props.signature === GridSignature.DataGridPro ? { api: apiRef.current } : {};
          controlState.propOnChange(model, details);
        }

        if (!ignoreSetState) {
          apiRef.current.publishEvent(controlState.changeEvent, model);
        }
      });

      return !ignoreSetState;
    },
    [apiRef, props.signature],
  );

  const forceUpdate = React.useCallback(() => rawForceUpdate(() => apiRef.current.state), [apiRef]);

  const stateApi: Omit<GridStateApi, 'state'> = {
    setState,
    forceUpdate,
    unstable_updateControlState: updateControlState,
  };

  useGridApiMethod(apiRef, stateApi, 'useGridStateInitialization');
};
