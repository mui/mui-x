import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import {
  DateTimeValidationError,
  FieldSection,
  PickerValidDate,
  BuiltInFieldTextFieldProps,
  BaseSingleInputFieldProps,
} from '../models';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseDateValidationProps, BaseTimeValidationProps } from '../internals/models/validation';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
  ExportedUseClearableFieldProps,
} from '../hooks/useClearableField';
import { DateTimeFieldInternalProps } from '../valueManagers';

export interface UseDateTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DateTimeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps {}

/**
 * Props the field can receive when used inside a date time picker.
 * (`DateTimePicker`, `DesktopDateTimePicker` or `MobileDateTimePicker` component).
 */
export type DateTimeFieldInPickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = DefaultizedProps<
  UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  | 'format'
  | 'timezone'
  | 'ampm'
  | keyof BaseDateValidationProps<TDate>
  | keyof BaseTimeValidationProps
> &
  BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, false, DateTimeValidationError>;

export type UseDateTimeFieldComponentProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>> &
  UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export type DateTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = UseDateTimeFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure,
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>
> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateTimeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
};

export type DateTimeFieldOwnerState<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = DateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
