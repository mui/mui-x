import { MakeOptional } from '@mui/x-internals/types';
import {
  UseDesktopPickerSlots,
  ExportedUseDesktopPickerSlotProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlots,
  BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DesktopDatePickerSlots
  extends BaseDatePickerSlots,
    MakeOptional<UseDesktopPickerSlots, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends BaseDatePickerSlotProps,
    ExportedUseDesktopPickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface DesktopDatePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends BaseDatePickerProps,
    DesktopOnlyPickerProps,
    ExportedYearCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
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
