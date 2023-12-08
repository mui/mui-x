import { TimeView } from '@mui/x-date-pickers/models';
import { MakeOptional, TimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlotsComponent,
  ExportedUseMobileRangePickerSlotsComponentsProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseTimeRangePickerProps,
  BaseTimeRangePickerSlotsComponent,
  BaseTimeRangePickerSlotsComponentsProps,
} from '../TimeRangePicker/shared';

export interface MobileTimeRangePickerSlotsComponent<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimeRangePickerSlotsComponent<TDate>,
    MakeOptional<UseMobileRangePickerSlotsComponent<TDate, TView>, 'field'> {}

export interface MobileTimeRangePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimeRangePickerSlotsComponentsProps,
    ExportedUseMobileRangePickerSlotsComponentsProps<TDate, TView> {}

export interface MobileTimeRangePickerProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimeRangePickerProps<TDate, TView>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimeRangePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimeRangePickerSlotsComponentsProps<TDate, TView>;
}
