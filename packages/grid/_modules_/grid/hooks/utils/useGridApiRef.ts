import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommon, GridApiCommunity, GridApiPro } from '../../models/api/gridApi';
import { EventManager } from '../../utils/EventManager';

// Public developers facing overload
export function useGridApiRef<GridApi extends GridApiCommon = GridApiPro>(): GridApiRef<GridApi>;

// Internal grid facing overload
export function useGridApiRef<GridApi extends GridApiCommon = GridApiCommunity>(
  apiRefProp: GridApiRef<GridApi> | undefined,
): GridApiRef<GridApi>;

/**
 * Hook that instantiate an GridApiRef to pass in component prop.
 */
export function useGridApiRef<GridApi extends GridApiCommon = GridApiCommunity>(...args): any {
  const apiRefProp = args[0];

  const apiRef = React.useRef<GridApi>();

  if (!apiRef.current) {
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      state: {} as GridApi['state'],
    } as GridApi;
  }

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
