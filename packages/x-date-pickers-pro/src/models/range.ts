import { PickerValidDate } from '@mui/x-date-pickers/models';

export type DateRange<TDate extends PickerValidDate> = [TDate | null, TDate | null];

// TODO v8: Remove
export type NonEmptyDateRange = [PickerValidDate, PickerValidDate];

export type RangePosition = 'start' | 'end';
