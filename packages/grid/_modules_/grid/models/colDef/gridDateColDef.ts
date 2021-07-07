import { gridDateComparer } from '../../utils/sortingUtils';
import { GridCellValue } from '../gridCell';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from './gridColDef';
import { renderEditDateCell } from '../../components/cell/GridEditDateCell';

export function gridDateFormatter({ value }: { value: GridCellValue }) {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return value;
}

export function gridDateTimeFormatter({ value }: { value: GridCellValue }) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return value;
}

export const GRID_DATE_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'date',
  sortComparator: gridDateComparer,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
  renderEditCell: renderEditDateCell,
};

export const GRID_DATETIME_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'dateTime',
  sortComparator: gridDateComparer,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
  renderEditCell: renderEditDateCell,
};
