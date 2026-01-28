import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiCommunity } from '../api/gridApiCommunity';
import { DataGridProcessedProps } from '../props/DataGridProps';
import { GridEditingApi } from '../api/gridEditingApi';

/**
 * Get the cell editable condition function
 * @param {Object} params The cell parameters
 * @param {Object} params.rowNode The row node
 * @param {Object} params.colDef The column definition
 * @param {any} params.value The cell value
 * @returns {boolean} Whether the cell is editable
 */
export type CellEditableConditionFn = (
  params: Parameters<GridEditingApi['isCellEditable']>[0],
) => boolean;

/**
 * Cell editable configuration interface for internal hooks
 */
export interface GridCellEditableInternalHook<
  Api = GridPrivateApiCommunity,
  Props = DataGridProcessedProps,
> {
  useIsCellEditable: (apiRef: RefObject<Api>, props: Props) => CellEditableConditionFn;
}
