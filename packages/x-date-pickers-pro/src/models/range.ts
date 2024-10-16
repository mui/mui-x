import { PickerValidDate } from '@mui/x-date-pickers/models';

export type DateRange = [PickerValidDate | null, PickerValidDate | null];

export type NonEmptyDateRange = [PickerValidDate, PickerValidDate];

export type RangePosition = 'start' | 'end';
