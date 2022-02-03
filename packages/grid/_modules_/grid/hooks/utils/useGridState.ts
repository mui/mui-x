import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * @deprecated Use `apiRef.current.state`, `apiRef.current.setState` and `apiRef.current.forceUpdate` instead.
 */
export const useGridState = <Api extends GridApiCommon = GridApiCommunity>(
  apiRef: React.MutableRefObject<Api>,
) => [apiRef.current.state, apiRef.current.setState, apiRef.current.forceUpdate] as const;
