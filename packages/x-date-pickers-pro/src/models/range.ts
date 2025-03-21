import { PickerValidDate } from '@mui/x-date-pickers/models';

// Should not be used in our packages, instead use `PickerRangeValue` from the community package.
export type DateRange<TDate extends PickerValidDate> = [TDate | null, TDate | null];
