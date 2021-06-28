export const GRID_STRING_COLUMN_TYPE = 'string';
export const GRID_NUMBER_COLUMN_TYPE = 'number';
export const GRID_DATE_COLUMN_TYPE = 'date';
export const GRID_DATETIME_COLUMN_TYPE = 'dateTime';
export const GRID_BOOLEAN_COLUMN_TYPE = 'boolean';

export type GridNativeColTypes =
  | 'string'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'singleSelect';
export type GridColType = GridNativeColTypes | string;
