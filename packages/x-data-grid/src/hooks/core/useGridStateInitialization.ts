import * as React from 'react';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { GridStateApi, GridStatePrivateApi } from '../../models/api/gridStateApi';
import { GridControlStateItem } from '../../models/controlStateItem';
import { useGridApiMethod } from '../utils';
import { isFunction } from '../../utils/utils';

export const useGridStateInitialization = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: React.RefObject<PrivateApi>,
) => {
  const controlStateMapRef = React.useRef<
    Record<string, GridControlStateItem<PrivateApi['state'], any>>
  >({});
  const [, rawForceUpdate] = React.useState<PrivateApi['state']>();

  const registerControlState = React.useCallback<
    GridStatePrivateApi<PrivateApi['state']>['registerControlState']
  >((controlStateItem) => {
    controlStateMapRef.current[controlStateItem.stateId] = controlStateItem;
  }, []);

  const setState = React.useCallback<GridStateApi<PrivateApi['state']>['setState']>(
    (state, reason) => {
      let newState: PrivateApi['state'];
      if (isFunction(state)) {
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
        const oldSubState = controlState.stateSelector(
          apiRef.current.state,
          apiRef.current.instanceId,
        );

        const newSubState = controlState.stateSelector(newState, apiRef.current.instanceId);
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
            updatedControlStateIds[0].stateId
          }, therefore, you're not allowed to update ${updatedControlStateIds
            .map((el) => el.stateId)
            .join(', ')} in the same transaction.`,
        );
      }

      if (!ignoreSetState) {
        // We always assign it as we mutate rows for perf reason.
        apiRef.current.state = newState;
        apiRef.current.publishEvent('stateChange', newState);
        apiRef.current.store.update(newState);
      }

      if (updatedControlStateIds.length === 1) {
        const { stateId, hasPropChanged } = updatedControlStateIds[0];
        const controlState = controlStateMapRef.current[stateId];
        const model = controlState.stateSelector(newState, apiRef.current.instanceId);

        if (controlState.propOnChange && hasPropChanged) {
          controlState.propOnChange(model, {
            reason,
            api: apiRef.current,
          });
        }

        if (!ignoreSetState) {
          apiRef.current.publishEvent(controlState.changeEvent, model, { reason });
        }
      }

      return !ignoreSetState;
    },
    [apiRef],
  );

  const updateControlState = React.useCallback<
    GridStatePrivateApi<PrivateApi['state']>['updateControlState']
  >(
    (key, state, reason) => {
      return apiRef.current.setState((previousState: PrivateApi['state']) => {
        return { ...previousState, [key]: state(previousState[key]) };
      }, reason);
    },
    [apiRef],
  );

  const forceUpdate = React.useCallback(() => rawForceUpdate(() => apiRef.current.state), [apiRef]);

  const publicStateApi: Omit<GridStateApi<PrivateApi['state']>, 'state'> = {
    setState,
    forceUpdate,
  };

  const privateStateApi: GridStatePrivateApi<PrivateApi['state']> = {
    updateControlState,
    registerControlState,
  };

  useGridApiMethod(apiRef, publicStateApi as any, 'public');
  useGridApiMethod(apiRef, privateStateApi as any, 'private');
};
