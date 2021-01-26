import * as React from 'react';
import { ApiContext } from '../../components/api-context';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { EventEmitter } from '../../utils/EventEmitter';
import { useForkRef } from '@material-ui/core/utils';

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */

function createGridApi(): GridApi {
  return new EventEmitter() as GridApi;
}

export function useApiRef(apiRefProp?: ApiRef): ApiRef {
  // const internalApiRef = React.useRef<GridApi>(createGridApi());
  // const apiRef = React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);
  // return apiRef;

  const apiRef = React.useContext(ApiContext);
  const internalApiRef = React.useRef<GridApi>(createGridApi());
  // if(apiRefProp) {
  //   return apiRefProp;
  // }

if(apiRef) {
  return apiRef
}
return internalApiRef
  // const apiRef = useForkRef(internalApiRef, apiRefProp);
    
    //React.useMemo(() => apiRefProp || internalApiRef, [apiRefProp, internalApiRef]);

  // return apiRef;
}
