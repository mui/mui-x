import { FieldSection } from '@mui/x-date-pickers/internals-fields';

export type DateRange<TDate> = [TDate | null, TDate | null];
export type NonEmptyDateRange<TDate> = [TDate, TDate];

export interface CurrentlySelectingRangeEndProps {
  currentlySelectingRangeEnd: 'start' | 'end';
  setCurrentlySelectingRangeEnd: (newSelectingEnd: 'start' | 'end') => void;
}

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
