import {
  PickersPopperSlots,
  PickersPopperSlotProps,
  UsePickerViewsProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  RangeOnlyPickerProps,
  RangePickerAdditionalViewProps,
  UseRangePickerParams,
  UseRangePickerProps,
  UseRangePickerSlotProps,
  UseRangePickerSlots,
} from '../models/useRangePicker';

export interface UseDesktopRangePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends UseRangePickerSlots<TView>,
    PickersPopperSlots {}

export interface UseDesktopRangePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseRangePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>,
    PickersPopperSlotProps {}

export interface DesktopRangeOnlyPickerProps extends RangeOnlyPickerProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends UseRangePickerProps<
    TView,
    TError,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopRangePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}

export interface DesktopRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseDesktopRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends UseRangePickerParams<TView, TExternalProps, DesktopRangePickerAdditionalViewProps> {
  /**
   * If `true`, the popper will always be aligned on the currently focused input.
   * This is helpful when the view only renders information about one of the dates.
   * @default false
   */
  shouldMovePopperToFocusedInput?: boolean;
}
