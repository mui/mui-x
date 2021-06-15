import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { GridEventEmitter } from '../../utils/eventEmitter/GridEventEmitter';

/**
 * Hook that instantiate an GridApiRef to pass in component prop.
 */
function createGridApi(): GridApi {
  return new GridEventEmitter() as GridApi;
}

// Public developers facing overload
export function useGridApiRef(): GridApiRef;

// Internal grid facing overload
export function useGridApiRef(apiRefProp: GridApiRef | undefined): GridApiRef;

export function useGridApiRef(...args): any {
  const apiRefProp = args[0];
  const apiRef = React.useRef<GridApi>(createGridApi());

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
