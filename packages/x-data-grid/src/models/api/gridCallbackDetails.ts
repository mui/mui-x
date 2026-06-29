import type { RefObject } from '@mui/x-internals/types';
import type { GridControlledStateReasonLookup } from '../events/gridEventLookup';
import type { GridApiCommon } from './gridApiCommon';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<K extends keyof GridControlledStateReasonLookup = any> {
  /**
   * The reason for this callback to have been called.
   */
  reason?: GridControlledStateReasonLookup[K];
  // TODO: deprecate in v10
  /**
   * GridApi that let you manipulate the grid.
   */
  api: GridApiCommon;
  /**
   * A ref to the GridApi that let you manipulate the grid.
   * Can be used to call selectors without a separate `useGridApiRef`.
   * @example
   * onRowSelectionModelChange={(model, details) => {
   *   const rows = gridRowSelectionIdsSelector(details.apiRef);
   * }}
   */
  apiRef?: RefObject<GridApiCommon>;
}
