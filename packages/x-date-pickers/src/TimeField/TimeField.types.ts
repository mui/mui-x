import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { PickerValidDate, BuiltInFieldTextFieldProps } from '../models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
  ExportedUseClearableFieldProps,
} from '../hooks/useClearableField';
import { TimeFieldInternalProps } from '../valueManagers';

export interface UseTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends TimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps {}

export type UseTimeFieldComponentProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>> &
  UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export type TimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = UseTimeFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure,
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>
> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TimeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
};

export type TimeFieldOwnerState<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = TimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface TimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    TimeFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
