import * as React from 'react';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { GridStateApi } from '../../models/api/gridStateApi';
import { GridControlStateItem } from '../../models/controlStateItem';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { GridEvents } from '../../models/events';
import { useGridApiMethod } from '../utils';
import { isFunction } from '../../utils/utils';

export const useGridStateInitialization = <Api extends GridApiCommon>(
  apiRef: React.MutableRefObject<Api>,
  props: Pick<DataGridProcessedProps, 'signature'>,
) => {
  const controlStateMapRef = React.useRef<Record<string, GridControlStateItem<Api['state'], any>>>(
    {},
  );
  const [, rawForceUpdate] = React.useState<Api['state']>();

  const updateControlState = React.useCallback<
    GridStateApi<Api['state']>['unstable_updateControlState']
  >((controlStateItem) => {
    const { stateId, ...others } = controlStateItem;

    controlStateMapRef.current[stateId] = {
      ...others,
      stateId,
    };
  }, []);

  const setState = React.useCallback<GridStateApi<Api['state']>['setState']>(
    (state) => {
      let newState: Api['state'];
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

        if (apiRef.current.publishEvent) {
          apiRef.current.publishEvent(GridEvents.stateChange, newState);
        }
      }

      if (updatedControlStateIds.length === 1) {
        const { stateId, hasPropChanged } = updatedControlStateIds[0];
        const controlState = controlStateMapRef.current[stateId];
        const model = controlState.stateSelector(newState, apiRef.current.instanceId);

        if (controlState.propOnChange && hasPropChanged) {
          const details =
            props.signature === GridSignature.DataGridPro ? { api: apiRef.current } : {};
          controlState.propOnChange(model, details);
        }

        if (!ignoreSetState) {
          apiRef.current.publishEvent(controlState.changeEvent, model);
        }
      }

      return !ignoreSetState;
    },
    [apiRef, props.signature],
  );

  const forceUpdate = React.useCallback(() => rawForceUpdate(() => apiRef.current.state), [apiRef]);

  const stateApi: any = {
    setState,
    forceUpdate,
    unstable_updateControlState: updateControlState,
  };

  useGridApiMethod(apiRef, stateApi, 'GridStateApi');
};
