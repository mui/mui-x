import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
  UsePickerProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  PickerFieldUISlotsFromContext,
  PickerFieldUISlotPropsFromContext,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotProps,
  ExportedPickersLayoutSlots,
  PickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  NonStaticRangePickerProps,
  NonStaticRangePickerHookParameters,
  UseRangePickerProps,
} from '../../models';
import { PickerRangeFieldSlotProps } from '../../../models';

export interface UseMobileRangePickerSlots
  extends
    PickersModalDialogSlots,
    ExportedPickersLayoutSlots<PickerRangeValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface ExportedUseMobileRangePickerSlotProps
  extends
    PickersModalDialogSlotProps,
    ExportedPickersLayoutSlotProps<PickerRangeValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<PickerRangeFieldSlotProps, {}, PickerOwnerState>;
}

export interface UseMobileRangePickerSlotProps
  extends
    ExportedUseMobileRangePickerSlotProps,
    Pick<PickersLayoutSlotProps<PickerRangeValue>, 'toolbar'> {}

export interface MobileRangeOnlyPickerProps extends NonStaticRangePickerProps {}

export interface UseMobileRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerRangeValue, TView, TError, any>,
> extends UseRangePickerProps<TView, TError, TExternalProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobileRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotProps;
}

export interface UseMobileRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobileRangePickerProps<TView, any, TExternalProps>,
> extends NonStaticRangePickerHookParameters<TView, TExternalProps> {}
