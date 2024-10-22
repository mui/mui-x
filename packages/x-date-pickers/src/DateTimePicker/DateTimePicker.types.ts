import { UseDateTimeFieldProps } from '../DateTimeField';
import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlots,
  DesktopDateTimePickerSlotProps,
} from '../DesktopDateTimePicker';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseDateValidationProps, BaseTimeValidationProps } from '../internals/models/validation';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlots,
  MobileDateTimePickerSlotProps,
} from '../MobileDateTimePicker';
import {
  BaseSingleInputFieldProps,
  DateTimeValidationError,
  FieldSection,
  PickerValidDate,
} from '../models';
import { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DateTimePickerSlots
  extends DesktopDateTimePickerSlots,
    MobileDateTimePickerSlots<DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateTimePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateTimePickerSlotProps<DateOrTimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure> {}

<<<<<<< HEAD
export interface DateTimePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDateTimePickerProps<TEnableAccessibleFieldDOMStructure>,
=======
export interface DateTimePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends DesktopDateTimePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
>>>>>>> master
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
 * Props the field can receive when used inside a date time picker.
 * (`DateTimePicker`, `DesktopDateTimePicker` or `MobileDateTimePicker` component).
 */
<<<<<<< HEAD
export type DateTimePickerFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  DefaultizedProps<
    UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
    | 'format'
    | 'timezone'
    | 'value'
    | 'ampm'
    | keyof BaseDateValidationProps
    | keyof BaseTimeValidationProps
  > &
    BaseSingleInputFieldProps<PickerValidDate | null, FieldSection, false, DateTimeValidationError>;
=======
export type DateTimePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = DefaultizedProps<
  UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  | 'format'
  | 'timezone'
  | 'ampm'
  | keyof BaseDateValidationProps<TDate>
  | keyof BaseTimeValidationProps
> &
  BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, false, DateTimeValidationError>;
>>>>>>> master
