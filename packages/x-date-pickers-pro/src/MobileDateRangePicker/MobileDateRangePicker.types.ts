import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlotsComponent,
  UseMobileRangePickerSlotsComponentsProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlotsComponent,
  BaseDateRangePickerSlotsComponentsProps,
} from '../DateRangePicker/shared';

export interface MobileDateRangePickerSlotsComponent<TDate>
  extends BaseDateRangePickerSlotsComponent<TDate>,
    MakeOptional<UseMobileRangePickerSlotsComponent<TDate, 'day'>, 'field'> {}

export interface MobileDateRangePickerSlotsComponentsProps<TDate>
  extends BaseDateRangePickerSlotsComponentsProps<TDate>,
    UseMobileRangePickerSlotsComponentsProps<TDate, 'day'> {}

export interface MobileDateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateRangePickerSlotsComponentsProps<TDate>;
}
