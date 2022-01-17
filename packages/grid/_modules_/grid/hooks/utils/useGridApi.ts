import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommunity } from '../../models/api/gridApi';

/**
 * @deprecated Use `apiRef.current` instead.
 */
export const useGridApi = <GridApi extends GridApiCommunity>(
  apiRef: GridApiRef<GridApi>,
): GridApi => apiRef.current;
