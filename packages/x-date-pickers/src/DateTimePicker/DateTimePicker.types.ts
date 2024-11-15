import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlots,
  DesktopDateTimePickerSlotProps,
} from '../DesktopDateTimePicker';
import { BaseSingleInputFieldProps, DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlots,
  MobileDateTimePickerSlotProps,
} from '../MobileDateTimePicker';
import { DateTimeValidationError, FieldSection, PickerValidDate } from '../models';
import { ValidateDateTimeProps } from '../validation';
import { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DateTimePickerSlots
  extends DesktopDateTimePickerSlots,
    MobileDateTimePickerSlots<DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateTimePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateTimePickerSlotProps<DateOrTimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure> {}

export interface DateTimePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDateTimePickerProps<TEnableAccessibleFieldDOMStructure>,
    ExportedYearCalendarProps,
    Omit<
      MobileDateTimePickerProps<DateOrTimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure>,
      'views'
    > {
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
  slotProps?: DateTimePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
}

/**
 * Props the field can receive when used inside a date time picker (<DateTimePicker />, <DesktopDateTimePicker /> or <MobileDateTimePicker /> component).
 */
export type DateTimePickerFieldProps = ValidateDateTimeProps &
  BaseSingleInputFieldProps<PickerValidDate | null, FieldSection, false, DateTimeValidationError>;
