import { TimeView } from '@mui/x-date-pickers/models';
import {
  MakeOptional,
  TimeViewWithMeridiem,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
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
    MakeOptional<UseMobileRangePickerSlotsComponent<TDate, TView>, 'Field'> {}

export interface MobileTimeRangePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimeRangePickerSlotsComponentsProps,
    ExportedUseMobileRangePickerSlotsComponentsProps<TDate, TView> {}

export interface MobileTimeRangePickerProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimeRangePickerProps<TDate, TView>,
    MobileRangeOnlyPickerProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileTimeRangePickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimeRangePickerSlotsComponentsProps<TDate>;
}
