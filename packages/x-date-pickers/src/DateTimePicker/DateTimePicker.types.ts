import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlotsComponent,
  DesktopDateTimePickerSlotsComponentsProps,
} from '../DesktopDateTimePicker';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlotsComponent,
  MobileDateTimePickerSlotsComponentsProps,
} from '../MobileDateTimePicker';

export interface DateTimePickerSlotsComponents<TDate>
  extends DesktopDateTimePickerSlotsComponent<TDate>,
    MobileDateTimePickerSlotsComponent<TDate, DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotsComponentsProps<TDate>
  extends DesktopDateTimePickerSlotsComponentsProps<TDate>,
    MobileDateTimePickerSlotsComponentsProps<TDate, DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerProps<TDate>
  extends DesktopDateTimePickerProps<TDate>,
    Omit<MobileDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem>, 'views'> {
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
  components?: DateTimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DateTimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimePickerSlotsComponentsProps<TDate>;
}
