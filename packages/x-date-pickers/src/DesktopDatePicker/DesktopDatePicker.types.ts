import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseDesktopPickerSlots,
  type ExportedUseDesktopPickerSlotProps,
  type DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  type BaseDatePickerProps,
  type BaseDatePickerSlots,
  type BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import { type ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DesktopDatePickerSlots
  extends BaseDatePickerSlots, MakeOptional<UseDesktopPickerSlots, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps
  extends BaseDatePickerSlotProps, ExportedUseDesktopPickerSlotProps {}

export interface DesktopDatePickerProps
  extends BaseDatePickerProps, DesktopOnlyPickerProps, ExportedYearCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotProps;
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default true
   */
  closeOnSelect?: boolean;
}
