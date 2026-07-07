import type {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlots,
  DesktopDateTimePickerSlotProps,
} from '../DesktopDateTimePicker';
import type { BaseSingleInputFieldProps } from '../internals/models';
import type {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlots,
  MobileDateTimePickerSlotProps,
} from '../MobileDateTimePicker';
import type { ValidateDateTimeProps } from '../validation';
import type { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DateTimePickerSlots
  extends DesktopDateTimePickerSlots, MobileDateTimePickerSlots {}

export interface DateTimePickerSlotProps
  extends DesktopDateTimePickerSlotProps, MobileDateTimePickerSlotProps {}

export interface DateTimePickerProps
  extends
    DesktopDateTimePickerProps,
    ExportedYearCalendarProps,
    Omit<MobileDateTimePickerProps, 'views'> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimePickerSlotProps;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
}

/**
 * Props the field can receive when used inside a Date Time Picker (<DateTimePicker />, <DesktopDateTimePicker /> or <MobileDateTimePicker /> component).
 */
export type DateTimePickerFieldProps = ValidateDateTimeProps & BaseSingleInputFieldProps;
