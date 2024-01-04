import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import {
  DateValidationError,
  FieldSection,
  BuiltInFieldTextFieldProps,
  FieldTextFieldVersion,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';

export interface UseDateFieldProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TTextFieldVersion,
        DateValidationError
      >,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    ExportedUseClearableFieldProps {}

export type UseDateFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateFieldProps<TDate, TTextFieldVersion>> &
  UseDateFieldProps<TDate, TTextFieldVersion>;

export type DateFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = UseDateFieldComponentProps<
  TDate,
  TTextFieldVersion,
  BuiltInFieldTextFieldProps<TTextFieldVersion>
> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateFieldSlotProps<TDate, TTextFieldVersion>;
};

export type DateFieldOwnerState<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> = DateFieldProps<TDate, TTextFieldVersion>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateFieldOwnerState<TDate, TTextFieldVersion>
  >;
}
