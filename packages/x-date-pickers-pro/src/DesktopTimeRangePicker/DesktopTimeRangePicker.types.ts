import { PickerValidDate, TimeView } from '@mui/x-date-pickers/models';
import {
  MakeOptional,
  DesktopOnlyTimePickerProps,
  TimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseTimeRangePickerProps,
  BaseTimeRangePickerSlots,
  BaseTimeRangePickerSlotProps,
} from '../TimeRangePicker/shared';

export interface DesktopTimeRangePickerSlots<TDate extends PickerValidDate>
  extends BaseTimeRangePickerSlots<TDate>,
    MakeOptional<UseDesktopRangePickerSlots<TDate, TimeViewWithMeridiem>, 'field'> {}

export interface DesktopTimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseTimeRangePickerSlotProps,
    Omit<
      UseDesktopRangePickerSlotProps<
        TDate,
        TimeViewWithMeridiem,
        TEnableAccessibleFieldDOMStructure
      >,
      'tabs' | 'toolbar'
    > {}

export interface DesktopTimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends BaseTimeRangePickerProps<TDate>,
    DesktopRangeOnlyPickerProps,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Available views.
   */
  views?: readonly TimeView[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}
