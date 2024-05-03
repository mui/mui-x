import {
  PickersPopperSlots,
  PickersPopperSlotProps,
  UsePickerViewsProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  RangeOnlyPickerProps,
  RangePickerAdditionalViewProps,
  UseRangePickerParams,
  UseRangePickerProps,
  UseRangePickerSlotProps,
  UseRangePickerSlots,
} from '../models/useRangePicker';

export interface UseDesktopRangePickerSlots<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlots<TDate, TView>,
    PickersPopperSlots {}

export interface UseDesktopRangePickerSlotProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseRangePickerSlotProps<TDate, TView, TEnableAccessibleFieldDOMStructure>,
    PickersPopperSlotProps {}

export interface DesktopRangeOnlyPickerProps extends RangeOnlyPickerProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
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
  slotProps?: UseDesktopRangePickerSlotProps<TDate, TView, TEnableAccessibleFieldDOMStructure>;
}

export interface DesktopRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseDesktopRangePickerParams<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopRangePickerProps<
    TDate,
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {}
