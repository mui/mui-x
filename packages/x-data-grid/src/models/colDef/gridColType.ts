export interface GridColumnTypes {
  string: 'string';
  number: 'number';
  date: 'date';
  dateTime: 'dateTime';
  boolean: 'boolean';
  singleSelect: 'singleSelect';
  actions: 'actions';
  custom: 'custom';
  longText: 'longText';
}

export type GridColType = GridColumnTypes[keyof GridColumnTypes];
