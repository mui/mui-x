import { MakeOptional } from '@mui/x-internals/types';
import {
  UseDesktopRangePickerSlots,
  UseDesktopRangePickerSlotProps,
  DesktopRangeOnlyPickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import {
  BaseDateRangePickerProps,
  BaseDateRangePickerSlots,
  BaseDateRangePickerSlotProps,
} from '../DateRangePicker/shared';

export interface DesktopDateRangePickerSlots
  extends BaseDateRangePickerSlots,
    MakeOptional<UseDesktopRangePickerSlots, 'field'> {}

export interface DesktopDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends BaseDateRangePickerSlotProps,
    Omit<UseDesktopRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>, 'tabs' | 'toolbar'> {}

export interface DesktopDateRangePickerProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseDateRangePickerProps,
    DesktopRangeOnlyPickerProps {
  /**
   * The number of calendars to render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default true
   */
  closeOnSelect?: boolean;
}
