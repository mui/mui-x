import { TimeView } from '@mui/x-date-pickers/models';
import {
  MakeOptional,
  UncapitalizeObjectKeys,
  DesktopOnlyTimePickerProps,
  TimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  ExportedUseDesktopRangePickerSlotsComponentsProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseTimeRangePickerProps,
  BaseTimeRangePickerSlotsComponent,
  BaseTimeRangePickerSlotsComponentsProps,
} from '../TimeRangePicker/shared';

export interface DesktopTimeRangePickerSlotsComponent<TDate>
  extends BaseTimeRangePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, TimeViewWithMeridiem>, 'Field'> {}

export interface DesktopTimeRangePickerSlotsComponentsProps<TDate>
  extends BaseTimeRangePickerSlotsComponentsProps,
    ExportedUseDesktopRangePickerSlotsComponentsProps<TDate, TimeViewWithMeridiem> {}

export interface DesktopTimeRangePickerProps<TDate>
  extends BaseTimeRangePickerProps<TDate, TimeViewWithMeridiem>,
    DesktopRangeOnlyPickerProps<TDate>,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Available views.
   */
  views?: readonly TimeView[];
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeRangePickerSlotsComponentsProps<TDate>;
}
