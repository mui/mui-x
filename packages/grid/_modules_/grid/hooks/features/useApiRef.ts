import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
function createGridApi(): GridApi {
  return new EventEmitter() as GridApi;
}

// Public developers facing overload
export function useApiRef(): ApiRef;

// Internal grid facing overload
export function useApiRef(apiRefProp: ApiRef | undefined): ApiRef;

export function useApiRef(...args): any {
  const apiRefProp = args[0];
  const apiRef = React.useRef<GridApi>(args.length === 0 ? null : createGridApi());

  React.useImperativeHandle(apiRefProp, () => apiRef.current, [apiRef]);

  return apiRef;
}
