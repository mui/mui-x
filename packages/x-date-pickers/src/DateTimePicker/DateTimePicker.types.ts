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

export interface DateTimePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateTimePickerSlots<TDate>,
    MobileDateTimePickerSlots<TDate, DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopDateTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateTimePickerSlotProps<
      TDate,
      DateOrTimeViewWithMeridiem,
      TEnableAccessibleFieldDOMStructure
    > {}

export interface DateTimePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends DesktopDateTimePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    ExportedYearCalendarProps,
    Omit<
      MobileDateTimePickerProps<
        TDate,
        DateOrTimeViewWithMeridiem,
        TEnableAccessibleFieldDOMStructure
      >,
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
  slots?: DateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
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
export type DateTimePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = DefaultizedProps<
  UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  | 'format'
  | 'timezone'
  | 'ampm'
  | keyof BaseDateValidationProps<TDate>
  | keyof BaseTimeValidationProps
> &
  BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, false, DateTimeValidationError>;
