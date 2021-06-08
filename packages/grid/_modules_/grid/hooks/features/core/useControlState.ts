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
// useControlledState(apiRef, props);

// block the state from changing if there is a model an onChange
// bind options.model to state.model with onChange
// onChange is the new state updater for that function
//
export function useControlState(apiRef: GridApiRef, props) {
  const controlStateMapRef = React.useRef<Record<string, ControlStateItem>>({});

  // // this hook prepare a map that can be stored in the state
  // if (props.filterModel && props.onFilterModelChange) {
  //   controlStateMapRef.current.push({
  //     propModel: props?.filterModel,
  //     propOnChange: props?.onFilterModelChange,
  //     // each model should have a specific state selector
  //     // by convention
  //     // nameModel, onNameModelChange, state.name
  //     stateSelector: (state: GridState) => state.filter,
  //   });
  // }

  // React.useEffect(()=> {
  //   if (props.filterModel && props.onFilterModelChange) {
  //     controlStateMapRef.current.push({
  //       propModel: props?.filterModel,
  //       propOnChange: props?.onFilterModelChange,
  //       // each model should have a specific state selector
  //       // by convention
  //       // nameModel, onNameModelChange, state.name
  //       stateSelector: (state: GridState) => state.filter,
  //     });
  //   }
  // }, [props.filterModel, props.onFilterModelChange])

  apiRef.current.controlStateRef = controlStateMapRef

  const registerControlState = React.useCallback(({stateId, propModel, propOnChange, stateSelector}: ControlStateItem )=> {
    controlStateMapRef.current[stateId] = {
      stateId,
      propModel,
      propOnChange,
      stateSelector: !stateSelector ? state => state[stateId] : stateSelector
    };
  }, []);

  const controlStateApi: GridControlStateApi = {registerControlState};
  useGridApiMethod(apiRef, controlStateApi, 'controlStateApi')

  //return for now
  // but it should be in state so it is callable as part of the hooks plugins.

// // this wont work due to the fact that an event can't return a value
//   const handleStateChange = React.useCallback(({newState, oldState})=> {
//     const oldModel = controlStateMapTest.stateSelector(oldState);
//     const newModel = controlStateMapTest.stateSelector(newState);
//     if(newModel !== oldModel) {
//
//     }
//   }, []);
//
//   useGridApiEventHandler(apiRef, 'StateChanged', handleStateChange);

}
