import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  DateTimeValidationError,
  FieldSection,
  BuiltInFieldTextFieldProps,
  FieldTextFieldVersion,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  DateTimeValidationProps,
  DayValidationProps,
  MonthValidationProps,
  TimeValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';

export interface UseDateTimeFieldProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TTextFieldVersion,
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

export type UseDateTimeFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateTimeFieldProps<TDate, TTextFieldVersion>> &
  UseDateTimeFieldProps<TDate, TTextFieldVersion>;

export type DateTimeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = UseDateTimeFieldComponentProps<
  TDate,
  TTextFieldVersion,
  BuiltInFieldTextFieldProps<TTextFieldVersion>
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
  slotProps?: DateTimeFieldSlotProps<TDate, TTextFieldVersion>;
};

export type DateTimeFieldOwnerState<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> = DateTimeFieldProps<TDate, TTextFieldVersion>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TDate, TTextFieldVersion>
  >;
}
