export type GridNativeColTypes =
  | 'string'
  | 'number'
  | 'date'
  | 'time'
  | 'dateTime'
  | 'boolean'
  | 'singleSelect'
  | 'actions';

export type GridColType = GridNativeColTypes | string;
