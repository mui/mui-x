import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';

/**
 * @deprecated Use `apiRef.current` instead.
 */
export const useGridApi = (apiRef: GridApiRef): GridApi => apiRef.current;
