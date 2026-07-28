import type { MakeOptional } from '@mui/x-internals/types';
import type {
  UseDesktopPickerSlots,
  ExportedUseDesktopPickerSlotProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import type {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlots,
  BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';
import type { DateOrTimeView } from '../models';
import type { DigitalTimePickerProps } from '../internals/models/props/time';
import type { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DesktopDateTimePickerSlots
  extends
    BaseDateTimePickerSlots,
    MakeOptional<UseDesktopPickerSlots, 'field' | 'openPickerIcon'> {}

export interface DesktopDateTimePickerSlotProps
  extends BaseDateTimePickerSlotProps, ExportedUseDesktopPickerSlotProps {}

export interface DesktopDateTimePickerProps
  extends
    BaseDateTimePickerProps,
    DesktopOnlyPickerProps,
    DigitalTimePickerProps,
    ExportedYearCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimePickerSlotProps;
  /**
   * Available views.
   */
  views?: readonly DateOrTimeView[];
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
}
