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

export interface UseDesktopRangePickerSlotProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  Tabs extends boolean = true,
> extends UseRangePickerSlotProps<TDate, TView, Tabs>,
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
  Tabs extends boolean = true,
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
  slotProps?: UseDesktopRangePickerSlotProps<TDate, TView, Tabs>;
}

export interface DesktopRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps, Tabs>,
  Tabs extends boolean = true,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {}
