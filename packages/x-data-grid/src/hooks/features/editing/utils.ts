import type { GridColDef } from '../../../models/colDef/gridColDef';

export const getDefaultCellValue = (colDef: GridColDef) => {
  switch (colDef.type) {
    case 'boolean':
      return false;
    case 'date':
    case 'dateTime':
    case 'number':
      return undefined;
    case 'singleSelect':
      return '';
    case 'string':
    default:
      return '';
  }
};
