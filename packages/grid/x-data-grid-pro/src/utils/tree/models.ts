import { GridKeyValue, GridRowId } from '@mui/x-data-grid';

export interface RowTreeBuilderGroupingCriteria {
  field: string | null;
  key: GridKeyValue;
}

export interface RowTreeBuilderNode {
  id: GridRowId;
  path: RowTreeBuilderGroupingCriteria[];
}

export type GridTreePathDuplicateHandler = (
  firstId: GridRowId,
  secondId: GridRowId,
  path: RowTreeBuilderGroupingCriteria[],
) => void;
