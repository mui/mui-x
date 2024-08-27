import { GridKeyValue, GridRowId } from '@mui/x-data-grid';

export interface RowTreeBuilderGroupingCriterion {
  field: string | null;
  key: GridKeyValue | null;
}

export interface RowTreeBuilderNode {
  id: GridRowId;
  path: RowTreeBuilderGroupingCriterion[];
  serverChildrenCount?: number;
}

/**
 * Callback called when trying to insert a data row in the tree in place of an already existing data row.
 */
export type GridTreePathDuplicateHandler = (
  firstId: GridRowId,
  secondId: GridRowId,
  path: RowTreeBuilderGroupingCriterion[],
) => void;
