import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlots,
  DesktopDateTimePickerSlotProps,
} from '../DesktopDateTimePicker';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlots,
  MobileDateTimePickerSlotProps,
} from '../MobileDateTimePicker';

export interface DateTimePickerSlots<TDate>
  extends DesktopDateTimePickerSlots<TDate>,
    MobileDateTimePickerSlots<TDate, DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateTimePickerSlotProps<
      TDate,
      DateOrTimeViewWithMeridiem,
      TEnableAccessibleFieldDOMStructure
    > {}

export interface DateTimePickerProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends DesktopDateTimePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
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
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
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
}
