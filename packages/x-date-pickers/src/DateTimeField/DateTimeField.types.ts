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
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '../internals';
import { ExportedUseClearableFieldProps } from '../hooks/useClearableField';

export interface UseDateTimeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TUseV6TextField,
        DateTimeValidationError
      >,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps,
    DateTimeValidationProps<TDate>,
    ExportedUseClearableFieldProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseDateTimeFieldDefaultizedProps<
  TDate,
  TUseV6TextField extends boolean,
> = DefaultizedProps<
  UseDateTimeFieldProps<TDate, TUseV6TextField>,
  keyof BaseDateValidationProps<any> | keyof BaseTimeValidationProps | 'format'
>;

export type UseDateTimeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateTimeFieldProps<TDate, TUseV6TextField>> &
  UseDateTimeFieldProps<TDate, TUseV6TextField>;

export interface DateTimeFieldProps<TDate, TUseV6TextField extends boolean = false>
  extends UseDateTimeFieldComponentProps<TDate, TUseV6TextField, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateTimeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
}

export type DateTimeFieldOwnerState<TDate, TUseV6TextField extends boolean> = DateTimeFieldProps<
  TDate,
  TUseV6TextField
>;

export interface DateTimeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TDate, TUseV6TextField>
  >;
}
