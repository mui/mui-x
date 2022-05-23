import { GridKeyValue, GridRowId } from '@mui/x-data-grid';

export interface RowTreeBuilderGroupingCriterion {
  field: string | null;
  key: GridKeyValue;
}

export interface RowTreeBuilderNode {
  id: GridRowId;
  path: RowTreeBuilderGroupingCriterion[];
}

export type GridTreePathDuplicateHandler = (
  firstId: GridRowId,
  secondId: GridRowId,
  path: RowTreeBuilderGroupingCriterion[],
) => void;
