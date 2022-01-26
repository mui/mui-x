import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommon } from '../../models/api/gridApi';

/**
 * @deprecated Use `apiRef.current` instead.
 */
export const useGridApi = <GridApi extends GridApiCommon>(apiRef: GridApiRef<GridApi>): GridApi =>
  apiRef.current;
