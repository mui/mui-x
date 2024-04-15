// Update PickersComponentAgnosticLocaleText -> viewNames when adding new entries
export type FieldSectionType =
  | 'year'
  | 'month'
  | 'day'
  | 'weekDay'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'meridiem'
  | 'empty';

export type FieldSectionContentType = 'digit' | 'digit-with-letter' | 'letter';
