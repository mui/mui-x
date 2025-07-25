import { GridColDef } from '@mui/x-data-grid-pro';

export const getBlockedSections = (column: GridColDef): string[] => {
  if (column.type !== 'number') {
    return ['series'];
  }
  return [];
};

export const isBlockedForSection = (column: GridColDef, section: string) => {
  return getBlockedSections(column).includes(section);
};
