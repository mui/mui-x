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

export interface UseDesktopRangePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends UseRangePickerSlots<TDate, TView>,
    PickersPopperSlots {}

export interface UseDesktopRangePickerSlotProps<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends UseRangePickerSlotProps<TDate, TView>,
    PickersPopperSlotProps {}

export interface DesktopRangeOnlyPickerProps<TDate> extends RangeOnlyPickerProps<TDate> {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends UseRangePickerProps<
    TDate,
    TView,
    TError,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopRangePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotProps<TDate, TView>;
}

export interface DesktopRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {}
