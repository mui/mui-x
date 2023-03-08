import {
  DesktopDatePickerProps,
  DesktopDatePickerSlotsComponent,
  DesktopDatePickerSlotsComponentsProps,
} from '../DesktopDatePicker';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
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
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DatePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DatePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DatePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotsComponentsProps<TDate>;
}
