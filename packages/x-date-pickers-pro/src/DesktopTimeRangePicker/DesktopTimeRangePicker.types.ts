import { TimeView } from '@mui/x-date-pickers/models';
import {
  MakeOptional,
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
    MakeOptional<UseDesktopRangePickerSlotsComponent<TDate, TimeViewWithMeridiem>, 'field'> {}

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
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeRangePickerSlotsComponentsProps<TDate>;
}
