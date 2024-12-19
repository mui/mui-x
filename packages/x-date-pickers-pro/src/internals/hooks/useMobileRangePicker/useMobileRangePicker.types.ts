import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
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

export interface UseMobileRangePickerSlots extends UseRangePickerSlots, PickersModalDialogSlots {}

export interface UseMobileRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    PickersModalDialogSlotProps {}

export interface MobileRangeOnlyPickerProps extends RangeOnlyPickerProps {}

export interface UseMobileRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends UseRangePickerProps<TView, TError, TExternalProps, MobileRangePickerAdditionalViewProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobileRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}

export interface MobileRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseMobileRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseMobileRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends UseRangePickerParams<TView, TExternalProps, MobileRangePickerAdditionalViewProps> {}
