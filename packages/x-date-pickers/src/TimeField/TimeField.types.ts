import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import { FieldsTextFieldProps } from '../internals/models/fields';
import { FieldSection, TimeValidationError } from '../models';
import { FieldSlots, FieldSlotProps } from '../internals/hooks/useField/useField.types';

export interface UseTimeFieldParams<TDate, TChildProps extends {}> {
  props: UseTimeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseTimeFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<TDate | null, TDate, FieldSection, TimeValidationError>,
      'format'
    >,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseTimeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseTimeFieldProps<TDate>,
  keyof BaseTimeValidationProps | 'format'
>;

export type UseTimeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseTimeFieldProps<TDate>
> &
  UseTimeFieldProps<TDate>;

export interface TimeFieldProps<TDate>
  extends UseTimeFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TimeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeFieldSlotProps<TDate>;
}

export type TimeFieldOwnerState<TDate> = TimeFieldProps<TDate>;

export interface TimeFieldSlots extends FieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<TDate> extends FieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, TimeFieldOwnerState<TDate>>;
}
