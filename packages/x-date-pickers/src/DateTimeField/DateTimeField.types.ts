import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { DateTimeValidationError, FieldSection, PickerValidDate } from '../models';
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
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '../hooks/useClearableField';

export interface UseDateTimeFieldProps<TDate extends PickerValidDate>
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

export type UseDateTimeFieldDefaultizedProps<TDate extends PickerValidDate> = DefaultizedProps<
  UseDateTimeFieldProps<TDate>,
  keyof BaseDateValidationProps<any> | keyof BaseTimeValidationProps | 'format'
>;

export type UseDateTimeFieldComponentProps<
  TDate extends PickerValidDate,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateTimeFieldProps<TDate>> & UseDateTimeFieldProps<TDate>;

export interface DateTimeFieldProps<TDate extends PickerValidDate>
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

export type DateTimeFieldOwnerState<TDate extends PickerValidDate> = DateTimeFieldProps<TDate>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<TDate extends PickerValidDate>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, DateTimeFieldOwnerState<TDate>>;
}
