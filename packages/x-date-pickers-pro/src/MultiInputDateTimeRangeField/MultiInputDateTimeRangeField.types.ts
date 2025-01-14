import * as React from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import type { StackProps } from '@mui/material/Stack';
import type { TextFieldProps } from '@mui/material/TextField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { UseDateTimeRangeFieldProps } from '../internals/models/dateTimeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { MultiInputFieldRefs, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputDateTimeRangeFieldParams<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
      UseDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {}

export type UseMultiInputDateTimeRangeFieldComponentProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<
  TChildProps,
  keyof UseMultiInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseMultiInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface MultiInputDateTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends UseMultiInputDateTimeRangeFieldComponentProps<
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
  slots?: MultiInputDateTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateTimeRangeFieldSlotProps;
}

export interface MultiInputDateTimeRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputDateTimeRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date and time.
   * It is rendered twice: once for the start date time and once for the end date time.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateTimeRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputDateTimeRangeFieldSlotProps {
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
