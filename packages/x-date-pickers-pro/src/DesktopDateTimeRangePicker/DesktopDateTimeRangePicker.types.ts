import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlots,
  BaseDateTimeRangePickerSlotProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerView } from '../internals/models';

export interface DesktopDateTimeRangePickerSlots<TDate extends PickerValidDate>
  extends BaseDateTimeRangePickerSlots<TDate>,
    MakeOptional<UseDesktopRangePickerSlots<TDate, DateTimeRangePickerView>, 'field'> {}

export interface DesktopDateTimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimeRangePickerSlotProps<TDate>,
    Omit<
      UseDesktopRangePickerSlotProps<
        TDate,
        DateTimeRangePickerView,
        TEnableAccessibleFieldDOMStructure
      >,
      'tabs' | 'toolbar'
    > {}

export interface DesktopDateTimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends BaseDateTimeRangePickerProps<TDate>,
    DesktopRangeOnlyPickerProps {
  /**
   * The number of calendars to render on **desktop**.
   * @default 1
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}
