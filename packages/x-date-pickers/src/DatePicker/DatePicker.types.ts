import {
  DesktopDatePickerProps,
  DesktopDatePickerSlotsComponent,
  DesktopDatePickerSlotsComponentsProps,
} from '../DesktopDatePicker';
import {
  MobileDatePickerProps,
  MobileDatePickerSlotsComponent,
  MobileDatePickerSlotsComponentsProps,
} from '../MobileDatePicker';

export interface DatePickerSlotsComponents<TDate>
  extends DesktopDatePickerSlotsComponent<TDate>,
    MobileDatePickerSlotsComponent<TDate> {}

export interface DatePickerSlotsComponentsProps<TDate>
  extends DesktopDatePickerSlotsComponentsProps<TDate>,
    MobileDatePickerSlotsComponentsProps<TDate> {}

export interface DatePickerProps<TDate>
  extends DesktopDatePickerProps<TDate>,
    MobileDatePickerProps<TDate> {
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
  slots?: DatePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotsComponentsProps<TDate>;
}
