import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  const internalApiRef = React.useRef<GridApi>(new EventEmitter() as GridApi);

  const apiRef = React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);

  return apiRef;
}
