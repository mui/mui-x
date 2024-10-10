import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UsePickerValueNonStaticProps } from '@mui/x-date-pickers/internals';
import {
  DesktopDateRangePickerProps,
  DesktopDateRangePickerSlots,
  DesktopDateRangePickerSlotProps,
} from '../DesktopDateRangePicker';
import {
  MobileDateRangePickerProps,
  MobileDateRangePickerSlots,
  MobileDateRangePickerSlotProps,
} from '../MobileDateRangePicker';

export interface DateRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateRangePickerSlots<TDate>,
    MobileDateRangePickerSlots<TDate> {}

export interface DateRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopDateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {}

export interface DateRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends DesktopDateRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure> {
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
  slots?: DateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  /**
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile variant (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: UsePickerValueNonStaticProps['closeOnSelect'];
}
