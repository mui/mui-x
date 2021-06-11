import React from 'react';
import { GridControlStateApi } from '../../../models/api/gridApi';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridState } from './gridState';

export interface ControlStateItem<TModel, TState> {
  stateId: string;
  propModel?: any;
  stateSelector: (state: GridState) => TState;
  propOnChange?: (...args) => void;
  onChangeCallback?: (...args) => void;
  mapStateToModel?: (state: TState) => TModel;
}

// block the state from changing if there is a model an onChange
// bind options.model to state.model with onChange
// onChange is the new state updater for that function
//
export function useControlState(apiRef: GridApiRef, props) {
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
