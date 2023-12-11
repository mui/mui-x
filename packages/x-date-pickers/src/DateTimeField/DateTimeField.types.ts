import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { DateTimeValidationError, FieldSection } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DayValidationProps,
  MonthValidationProps,
  TimeValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { FieldsTextFieldProps } from '../internals/models/fields';
import { FieldSlots, FieldSlotProps } from '../internals/hooks/useField/useField.types';

export interface UseDateTimeFieldParams<TDate, TChildProps extends {}> {
  props: UseDateTimeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseDateTimeFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<TDate | null, TDate, FieldSection, DateTimeValidationError>,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps,
    DateTimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseDateTimeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateTimeFieldProps<TDate>,
  keyof BaseDateValidationProps<any> | keyof BaseTimeValidationProps | 'format'
>;

export type UseDateTimeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseDateTimeFieldProps<TDate>
> &
  UseDateTimeFieldProps<TDate>;

export interface DateTimeFieldProps<TDate>
  extends UseDateTimeFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateTimeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeFieldSlotProps<TDate>;
}

export type DateTimeFieldOwnerState<TDate> = DateTimeFieldProps<TDate>;

export interface DateTimeFieldSlots extends FieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<TDate> extends FieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, DateTimeFieldOwnerState<TDate>>;
}
