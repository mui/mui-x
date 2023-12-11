import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlotsComponent,
  BaseDateTimeRangePickerSlotsComponentsProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerView } from '../internals/models';

export interface MobileDateTimeRangePickerSlotsComponent<TDate>
  extends BaseDateTimeRangePickerSlotsComponent<TDate>,
    MakeOptional<UseMobileRangePickerSlots<TDate, DateTimeRangePickerView>, 'field'> {}

export interface MobileDateTimeRangePickerSlotsComponentsProps<TDate>
  extends BaseDateTimeRangePickerSlotsComponentsProps<TDate>,
    Omit<UseMobileRangePickerSlotProps<TDate, DateTimeRangePickerView>, 'tabs'> {}

export interface MobileDateTimeRangePickerProps<TDate>
  extends BaseDateTimeRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **Mobile**.
   * @default 1
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotsComponentsProps<TDate>;
}
