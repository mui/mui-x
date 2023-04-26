import {
  DateTimeValidationError,
  DateValidationError,
  TimeValidationError,
} from '@mui/x-date-pickers/models';

type RangeValidation<ItemError extends string | null> = [
  ItemError | 'invalidRange',
  ItemError | 'invalidRange',
];

export type DateRangeValidationError = RangeValidation<DateValidationError>;

export type TimeRangeValidationError = RangeValidation<TimeValidationError>;

export type DateTimeRangeValidationError = RangeValidation<DateTimeValidationError>;
