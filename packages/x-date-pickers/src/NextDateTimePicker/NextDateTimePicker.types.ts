import {
  DesktopNextDateTimePickerProps,
  DesktopNextDateTimePickerSlotsComponent,
  DesktopNextDateTimePickerSlotsComponentsProps,
} from '../DesktopNextDateTimePicker';
import {
  MobileNextDateTimePickerProps,
  MobileNextDateTimePickerSlotsComponent,
  MobileNextDateTimePickerSlotsComponentsProps,
} from '../MobileNextDateTimePicker';

export interface NextDateTimePickerSlotsComponents<TDateTime>
  extends DesktopNextDateTimePickerSlotsComponent<TDateTime>,
    MobileNextDateTimePickerSlotsComponent<TDateTime> {}

export interface NextDateTimePickerSlotsComponentsProps<TDateTime>
  extends DesktopNextDateTimePickerSlotsComponentsProps<TDateTime>,
    MobileNextDateTimePickerSlotsComponentsProps<TDateTime> {}

export interface NextDateTimePickerProps<TDateTime>
  extends DesktopNextDateTimePickerProps<TDateTime>,
    MobileNextDateTimePickerProps<TDateTime> {
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
  components?: NextDateTimePickerSlotsComponents<TDateTime>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: NextDateTimePickerSlotsComponentsProps<TDateTime>;
}
