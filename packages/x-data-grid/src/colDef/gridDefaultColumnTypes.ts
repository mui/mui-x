import type { GridColumnTypesRecord } from '../models/colDef/gridColumnTypesRecord';
import { getGridColumnTypesRegistry } from './gridColumnTypesRegistry';

export { DEFAULT_GRID_COL_TYPE_KEY } from './gridColumnTypesRegistry';

export const getGridDefaultColumnTypes = (): GridColumnTypesRecord =>
  ({ ...getGridColumnTypesRegistry() }) as unknown as GridColumnTypesRecord;
