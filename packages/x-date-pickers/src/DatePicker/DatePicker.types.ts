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

export interface DatePickerSlotsComponents<TDate, TUseV6TextField extends boolean>
  extends DesktopDatePickerSlotsComponent<TDate, TUseV6TextField>,
    MobileDatePickerSlotsComponent<TDate, TUseV6TextField> {}

export interface DatePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends DesktopDatePickerSlotsComponentsProps<TDate, TUseV6TextField>,
    MobileDatePickerSlotsComponentsProps<TDate, TUseV6TextField> {}

export interface DatePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends DesktopDatePickerProps<TDate, TUseV6TextField>,
    MobileDatePickerProps<TDate, TUseV6TextField> {
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
  slots?: DatePickerSlotsComponents<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
