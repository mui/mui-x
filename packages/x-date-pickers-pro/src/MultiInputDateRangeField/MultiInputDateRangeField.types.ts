import * as React from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import type { StackProps } from '@mui/material/Stack';
import type { TextFieldProps } from '@mui/material/TextField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import {
  MultiInputFieldRefs,
  MultiInputRangeFieldClasses,
  RangePosition,
  UseDateRangeFieldProps,
} from '../models';

export type UseMultiInputDateRangeFieldParams<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
      UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {}

export type UseMultiInputDateRangeFieldComponentProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>> &
  UseMultiInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface MultiInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends UseMultiInputDateRangeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure,
    Omit<StackProps, 'position'>
  > {
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MultiInputRangeFieldClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MultiInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotProps;
}

export interface MultiInputDateRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputDateRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputDateRangeFieldSlotProps {
  root?: SlotComponentPropsFromProps<StackProps, {}, FieldOwnerState>;
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentPropsFromProps<TypographyProps, {}, FieldOwnerState>;
}
