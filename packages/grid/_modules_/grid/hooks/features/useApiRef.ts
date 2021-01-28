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

export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  const apiRef = React.useRef<GridApi>(createGridApi());

  React.useEffect(() => {
    if (apiRefProp?.current) {
      apiRefProp.current = apiRef.current;
    }
  });

  return apiRef;
}
