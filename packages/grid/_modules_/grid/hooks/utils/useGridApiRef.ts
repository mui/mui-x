import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { GridState } from '../../models/gridState';
import { EventManager } from '../../utils/EventManager';

let globalId = 0;

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
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      state: {} as GridState,
      instanceId: globalId,
    } as GridApi;

    globalId += 1;
  }

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
