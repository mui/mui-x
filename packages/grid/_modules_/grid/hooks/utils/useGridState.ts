import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommon, GridApiCommunity } from '../../models/api/gridApi';

/**
 * @deprecated Use `apiRef.current.state`, `apiRef.current.setState` and `apiRef.current.forceUpdate` instead.
 */
export const useGridState = <GridApi extends GridApiCommon = GridApiCommunity>(
  apiRef: GridApiRef<GridApi>,
) => [apiRef.current.state, apiRef.current.setState, apiRef.current.forceUpdate] as const;
