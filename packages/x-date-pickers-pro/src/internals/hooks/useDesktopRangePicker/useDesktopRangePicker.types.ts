import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickerFieldSlotProps, PickerOwnerState } from '@mui/x-date-pickers/models';
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

export interface UseDesktopRangePickerSlots
  extends PickerPopperSlots,
    ExportedPickersLayoutSlots<PickerRangeValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface UseDesktopRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends PickerPopperSlotProps,
    ExportedPickersLayoutSlotProps<PickerRangeValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerRangeValue, TEnableAccessibleFieldDOMStructure> & {
      dateSeparator?: string;
    },
    {},
    PickerOwnerState
  >;
}

export interface DesktopRangeOnlyPickerProps extends NonStaticRangePickerProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
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
  slotProps?: UseDesktopRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}

export interface UseDesktopRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends NonStaticRangePickerHookParameters<TView, TExternalProps> {}
