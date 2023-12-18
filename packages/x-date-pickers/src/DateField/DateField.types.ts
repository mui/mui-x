import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { DateValidationError, FieldSection, BuiltInFieldTextFieldProps } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';

export interface UseDateFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TUseV6TextField,
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
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateFieldProps<TDate, TUseV6TextField>> &
  UseDateFieldProps<TDate, TUseV6TextField>;

export type DateFieldProps<
  TDate,
  TUseV6TextField extends boolean = false,
> = UseDateFieldComponentProps<
  TDate,
  TUseV6TextField,
  BuiltInFieldTextFieldProps<TUseV6TextField>
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
  slotProps?: DateFieldSlotProps<TDate, TUseV6TextField>;
};

export type DateFieldOwnerState<TDate, TUseV6TextField extends boolean> = DateFieldProps<
  TDate,
  TUseV6TextField
>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps<TDate, TUseV6TextField extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, DateFieldOwnerState<TDate, TUseV6TextField>>;
}
