import { registerGridColumnTypes } from '@mui/x-data-grid/internals';
import { GRID_MULTI_SELECT_COL_DEF } from './gridMultiSelectColDef';

/**
 * Registers the `multiSelect` column type in the core column-type registry so core hydration
 * resolves its colDef defaults. Called at module load from the Pro/Premium grid component modules
 * (whose hook exports are used, so bundlers always evaluate them) — never from the community
 * bundle. `registerGridColumnTypes` is idempotent, so repeated calls are safe.
 */
export function registerMultiSelectColumnType() {
  registerGridColumnTypes({ multiSelect: GRID_MULTI_SELECT_COL_DEF });
}
