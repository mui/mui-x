import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DesktopTimeRangePickerProps,
  DesktopTimeRangePickerSlots,
  DesktopTimeRangePickerSlotProps,
} from '../DesktopTimeRangePicker';
import {
  MobileTimeRangePickerProps,
  MobileTimeRangePickerSlots,
  MobileTimeRangePickerSlotProps,
} from '../MobileTimeRangePicker';

export interface TimeRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopTimeRangePickerSlots<TDate>,
    MobileTimeRangePickerSlots<TDate> {}

export interface TimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {}

export interface TimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends DesktopTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    Omit<MobileTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>, 'views'> {
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
  slots?: TimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}
