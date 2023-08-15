import { MakeOptional, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlotsComponent,
  UseMobileRangePickerSlotsComponentsProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlotsComponent,
  BaseDateTimeRangePickerSlotsComponentsProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerViews } from '../internals/models';

export interface MobileDateTimeRangePickerSlotsComponent<TDate>
  extends BaseDateTimeRangePickerSlotsComponent<TDate>,
    MakeOptional<UseMobileRangePickerSlotsComponent<TDate, DateTimeRangePickerViews>, 'Field'> {}

export interface MobileDateTimeRangePickerSlotsComponentsProps<TDate>
  extends BaseDateTimeRangePickerSlotsComponentsProps<TDate>,
    UseMobileRangePickerSlotsComponentsProps<TDate, DateTimeRangePickerViews> {}

export interface MobileDateTimeRangePickerProps<TDate>
  extends BaseDateTimeRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * The number of calendars to render on **Mobile**.
   * @default 1
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileDateTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileDateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileDateTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotsComponentsProps<TDate>;
}
