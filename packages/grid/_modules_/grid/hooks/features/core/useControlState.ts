import React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridControlStateApi } from '../../../models/api/gridControlStateApi';
import { ControlStateItem } from '../../../models/controlStateItem';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export function useControlState(apiRef: GridApiRef) {
  const controlStateMapRef = React.useRef<Record<string, ControlStateItem<any, any>>>({});
  apiRef.current.controlStateRef = controlStateMapRef;

  const registerControlState = React.useCallback((controlStateItem: ControlStateItem<any, any>) => {
    const { stateId, stateSelector, ...others } = controlStateItem;

    controlStateMapRef.current[stateId] = {
      ...others,
      stateId,
      stateSelector: !stateSelector ? (state) => state[stateId] : stateSelector,
    };
  }, []);

  const controlStateApi: GridControlStateApi = { registerControlState };
  useGridApiMethod(apiRef, controlStateApi, 'controlStateApi');
}
