import { GridColDef } from '@mui/x-data-grid-pro';

export const getBlockedZones = (column: GridColDef): string[] => {
  if (column.type !== 'number') {
    return ['series'];
  }
  return [];
};
