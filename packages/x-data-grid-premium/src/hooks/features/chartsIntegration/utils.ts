import { GridColDef } from '@mui/x-data-grid-pro';
import { GridRowGroupingModel } from '../rowGrouping/gridRowGroupingInterfaces';

export const getBlockedSections = (
  column: GridColDef,
  rowGroupingModel: GridRowGroupingModel,
): string[] => {
  if (rowGroupingModel.length > 0) {
    return [];
  }
  if (column.type !== 'number') {
    return ['series'];
  }
  return [];
};

export const isBlockedForSection = (
  column: GridColDef,
  section: string,
  rowGroupingModel: GridRowGroupingModel,
) => getBlockedSections(column, rowGroupingModel).includes(section);
