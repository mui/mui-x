import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
  UsePickerViewsProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  RangeOnlyPickerProps,
  UseRangePickerParams,
  UseRangePickerProps,
  UseRangePickerSlotProps,
  UseRangePickerSlots,
} from '../models/useRangePicker';

export interface UseMobileRangePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends UseRangePickerSlots<TView>,
    PickersModalDialogSlots {}

export interface UseMobileRangePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseRangePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>,
    PickersModalDialogSlotProps {}

export interface MobileRangeOnlyPickerProps extends RangeOnlyPickerProps {}

export interface UseMobileRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any>,
> extends UseRangePickerProps<TView, TError, TExternalProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobileRangePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}

export interface UseMobileRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseMobileRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends UseRangePickerParams<TView, TExternalProps> {}
