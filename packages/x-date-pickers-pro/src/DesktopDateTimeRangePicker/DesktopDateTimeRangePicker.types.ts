import { MakeOptional } from '@mui/x-internals/types';
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

export interface DesktopDateTimeRangePickerSlots
  extends BaseDateTimeRangePickerSlots,
    MakeOptional<UseDesktopRangePickerSlots<DateTimeRangePickerView>, 'field'> {}

export interface DesktopDateTimeRangePickerSlotProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimeRangePickerSlotProps,
    Omit<
      UseDesktopRangePickerSlotProps<DateTimeRangePickerView, TEnableAccessibleFieldDOMStructure>,
      'tabs' | 'toolbar'
    > {}

export interface DesktopDateTimeRangePickerProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseDateTimeRangePickerProps,
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
  slots?: DesktopDateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}
