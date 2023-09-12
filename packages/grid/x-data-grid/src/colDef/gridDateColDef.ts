import { gridDateComparator } from '../hooks/features/sorting/gridSortingUtils';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from '../models/colDef/gridColDef';
import { renderEditDateCell } from '../components/cell/GridEditDateCell';
import { GridValueFormatterParams } from '../models/params/gridCellParams';

function throwIfNotDateObject({
  value,
  columnType,
  rowId,
  field,
}: {
  value: any;
  columnType: string;
  rowId: any;
  field: string;
}) {
  if (!(value instanceof Date)) {
    throw new Error(
      [
        `MUI: \`${columnType}\` column type only accepts \`Date\` objects as values.`,
        'Use `valueGetter` to transform the value into a `Date` object.',
        `Row ID: ${rowId}, field: "${field}".`,
      ].join('\n'),
    );
  }
}

export function gridDateFormatter({ value, field, id }: GridValueFormatterParams<Date>) {
  if (!value) {
    return '';
  }
  throwIfNotDateObject({ value, columnType: 'date', rowId: id, field });
  return value.toLocaleDateString();
}

export function gridDateTimeFormatter({ value, field, id }: GridValueFormatterParams<Date>) {
  if (!value) {
    return '';
  }
  throwIfNotDateObject({ value, columnType: 'dateTime', rowId: id, field });
  return value.toLocaleString();
}

export const GRID_DATE_COL_DEF: GridColTypeDef<Date, string> = {
  ...GRID_STRING_COL_DEF,
  type: 'date',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined,
  getApplyQuickFilterFnV7: undefined,
  // @ts-ignore
  pastedValueParser: (value) => new Date(value),
};

export const GRID_DATETIME_COL_DEF: GridColTypeDef<Date, string> = {
  ...GRID_STRING_COL_DEF,
  type: 'dateTime',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined,
  getApplyQuickFilterFnV7: undefined,
  // @ts-ignore
  pastedValueParser: (value) => new Date(value),
};
