import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';

const EventEmitter = require('events').EventEmitter;

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  const internalApiRef = React.useRef<GridApi>(new EventEmitter());

  const apiRef = React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);

  return apiRef;
}
