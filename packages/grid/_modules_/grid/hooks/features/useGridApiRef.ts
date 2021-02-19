import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';

/**
 * Hook that instantiate an GridApiRef to pass in component prop.
 */
function createGridApi(): GridApi {
  return new EventEmitter() as GridApi;
}

// Public developers facing overload
export function useGridApiRef(): GridApiRef;

// Internal grid facing overload
export function useGridApiRef(apiRefProp: GridApiRef | undefined): GridApiRef;

export function useGridApiRef(...args): any {
  const apiRefProp = args[0];
  const apiRef = React.useRef<GridApi>(args.length === 0 ? null : createGridApi());

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
