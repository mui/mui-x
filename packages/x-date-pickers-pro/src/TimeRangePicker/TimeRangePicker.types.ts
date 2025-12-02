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

export interface TimeRangePickerSlots
  extends DesktopTimeRangePickerSlots,
    MobileTimeRangePickerSlots {}

export interface TimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface TimeRangePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopTimeRangePickerProps<TEnableAccessibleFieldDOMStructure>,
    Omit<MobileTimeRangePickerProps<TEnableAccessibleFieldDOMStructure>, 'views'> {
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
  slots?: TimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}
