import { MakeOptional } from '@mui/x-internals/types';
import { DesktopOnlyTimePickerProps } from '@mui/x-date-pickers/internals';
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

export interface DesktopTimeRangePickerSlots
  extends BaseTimeRangePickerSlots,
    MakeOptional<UseDesktopRangePickerSlots, 'field'> {}

export interface DesktopTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends BaseTimeRangePickerSlotProps,
    Omit<UseDesktopRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>, 'tabs' | 'toolbar'> {}

export interface DesktopTimeRangePickerProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseTimeRangePickerProps,
    DesktopRangeOnlyPickerProps,
    DesktopOnlyTimePickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}
