import { GridColDef } from '../../../models/colDef/gridColDef';

export const getDefaultCellValue = (colDef: GridColDef) => {
  switch (colDef.type) {
    case 'boolean':
      return false;
    case 'date':
    case 'dateTime':
    case 'number':
      return undefined;
    case 'singleSelect':
      return null;
    case 'string':
    default:
      return '';
  }
};
