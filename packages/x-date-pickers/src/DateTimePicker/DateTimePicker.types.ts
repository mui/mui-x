import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlotsComponent,
  DesktopDateTimePickerSlotsComponentsProps,
} from '../DesktopDateTimePicker';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlotsComponent,
  MobileDateTimePickerSlotsComponentsProps,
} from '../MobileDateTimePicker';

export interface DateTimePickerSlotsComponents<TDate, TUseV6TextField extends boolean>
  extends DesktopDateTimePickerSlotsComponent<TDate, TUseV6TextField>,
    MobileDateTimePickerSlotsComponent<TDate, DateOrTimeViewWithMeridiem, TUseV6TextField> {}

export interface DateTimePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends DesktopDateTimePickerSlotsComponentsProps<TDate, TUseV6TextField>,
    MobileDateTimePickerSlotsComponentsProps<TDate, DateOrTimeViewWithMeridiem, TUseV6TextField> {}

export interface DateTimePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends DesktopDateTimePickerProps<TDate, TUseV6TextField>,
    Omit<MobileDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem, TUseV6TextField>, 'views'> {
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
  slots?: DateTimePickerSlotsComponents<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
