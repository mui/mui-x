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
import { DateView } from '../models';
import { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DesktopDatePickerSlots
  extends BaseDatePickerSlots,
    MakeOptional<UseDesktopPickerSlots<DateView>, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends BaseDatePickerSlotProps,
    ExportedUseDesktopPickerSlotProps<DateView, TEnableAccessibleFieldDOMStructure> {}

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
}
