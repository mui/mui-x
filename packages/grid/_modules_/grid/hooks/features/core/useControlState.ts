import React from 'react';
import { GridControlStateApi } from '../../../models/api/gridApi';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridState } from './gridState';

export interface ControlStateItem {
  stateId: string;
  propModel?: any;
  stateSelector: (state: GridState) => any;
  propOnChange?: (...args) => void
}

// block the state from changing if there is a model an onChange
// bind options.model to state.model with onChange
// onChange is the new state updater for that function
//
export function useControlState(apiRef: GridApiRef, props) {
  const controlStateMapRef = React.useRef<Record<string, ControlStateItem>>({});
  apiRef.current.controlStateRef = controlStateMapRef

  const registerControlState = React.useCallback(({
                                                    stateId,
                                                    propModel,
                                                    propOnChange,
                                                    stateSelector
                                                  }: ControlStateItem) => {
    controlStateMapRef.current[stateId] = {
      stateId,
      propModel,
      propOnChange,
      stateSelector: !stateSelector ? state => state[stateId] : stateSelector
    };
  }, []);

  const controlStateApi: GridControlStateApi = {registerControlState};
  useGridApiMethod(apiRef, controlStateApi, 'controlStateApi');
}
