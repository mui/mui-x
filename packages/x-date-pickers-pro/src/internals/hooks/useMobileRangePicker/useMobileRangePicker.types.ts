import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
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

export interface UseMobileRangePickerSlots<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlots<TDate, TView>,
    PickersModalDialogSlots {}

export interface UseMobileRangePickerSlotProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlotProps<TDate, TView>,
    PickersModalDialogSlotProps {}

export interface MobileRangeOnlyPickerProps<TDate extends PickerValidDate>
  extends RangeOnlyPickerProps<TDate> {}

export interface UseMobileRangePickerProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends UseRangePickerProps<
    TDate,
    TView,
    TError,
    TExternalProps,
    MobileRangePickerAdditionalViewProps
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobileRangePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotProps<TDate, TView>;
}

export interface MobileRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseMobileRangePickerParams<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    MobileRangePickerAdditionalViewProps
  > {}
