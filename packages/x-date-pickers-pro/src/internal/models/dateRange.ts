import { ParseableDate } from '@mui/x-pickers/internals';

export type RangeInput<TDate> = [ParseableDate<TDate>, ParseableDate<TDate>];
export type DateRange<TDate> = [TDate | null, TDate | null];
export type NonEmptyDateRange<TDate> = [TDate, TDate];

export interface CurrentlySelectingRangeEndProps {
  currentlySelectingRangeEnd: 'start' | 'end';
  setCurrentlySelectingRangeEnd: (newSelectingEnd: 'start' | 'end') => void;
}
