import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { GridEventEmitter } from '../../utils/eventEmitter/GridEventEmitter';

// Public developers facing overload
export function useGridApiRef(): GridApiRef;

// Internal grid facing overload
export function useGridApiRef(apiRefProp: GridApiRef | undefined): GridApiRef;

/**
 * Hook that instantiate an GridApiRef to pass in component prop.
 */
export function useGridApiRef(...args): any {
  const apiRefProp = args[0];

  const apiRef = React.useRef<GridApi>();

  if (!apiRef.current) {
    apiRef.current = new GridEventEmitter() as GridApi;
  }

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
