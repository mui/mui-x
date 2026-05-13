import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import {
  PickerPopperSlots,
  PickerPopperSlotProps,
  UsePickerProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  PickerFieldUISlotsFromContext,
  PickerFieldUISlotPropsFromContext,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotProps,
  ExportedPickersLayoutSlots,
} from '@mui/x-date-pickers/PickersLayout';
import {
  NonStaticRangePickerProps,
  NonStaticRangePickerHookParameters,
  UseRangePickerProps,
} from '../../models';
import { PickerRangeFieldSlotProps } from '../../../models';

export interface UseDesktopRangePickerSlots
  extends
    PickerPopperSlots,
    ExportedPickersLayoutSlots<PickerRangeValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface UseDesktopRangePickerSlotProps
  extends
    PickerPopperSlotProps,
    ExportedPickersLayoutSlotProps<PickerRangeValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<PickerRangeFieldSlotProps, {}, PickerOwnerState>;
}

export interface DesktopRangeOnlyPickerProps extends NonStaticRangePickerProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerRangeValue, TView, TError, any>,
> extends UseRangePickerProps<TView, TError, TExternalProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotProps;
}

export interface UseDesktopRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopRangePickerProps<TView, any, TExternalProps>,
> extends NonStaticRangePickerHookParameters<TView, TExternalProps> {}
