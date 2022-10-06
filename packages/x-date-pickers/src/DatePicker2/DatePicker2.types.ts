import {
  DesktopDatePicker2Props,
  DesktopDatePicker2SlotsComponent,
  DesktopDatePicker2SlotsComponentsProps,
} from '../DesktopDatePicker2';
import {
  MobileDatePicker2Props,
  MobileDatePicker2SlotsComponent,
  MobileDatePicker2SlotsComponentsProps,
} from '../MobileDatePicker2';

export interface DatePicker2SlotsComponents<TDate>
  extends DesktopDatePicker2SlotsComponent<TDate>,
    MobileDatePicker2SlotsComponent<TDate> {}

export interface DatePicker2SlotsComponentsProps<TDate>
  extends DesktopDatePicker2SlotsComponentsProps<TDate>,
    MobileDatePicker2SlotsComponentsProps<TDate> {}

export interface DatePicker2Props<TDate>
  extends DesktopDatePicker2Props<TDate>,
    MobileDatePicker2Props<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DatePicker2SlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DatePicker2SlotsComponentsProps<TDate>;
}
