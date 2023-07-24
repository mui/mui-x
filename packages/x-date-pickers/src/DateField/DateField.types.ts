import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '../internals';
import { DateValidationError, FieldSection } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { FieldsTextFieldProps } from '../internals/models/fields';
import { SlotsAndSlotProps } from '../internals/utils/slots-migration';

export interface UseDateFieldParams<TDate, TChildProps extends {}> {
  props: UseDateFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseDateFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<TDate | null, TDate, FieldSection, DateValidationError>,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseDateFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateFieldProps<TDate>,
  keyof BaseDateValidationProps<any> | 'format'
>;

export type UseDateFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseDateFieldProps<TDate>
> &
  UseDateFieldProps<TDate>;

export interface DateFieldProps<TDate>
  extends UseDateFieldComponentProps<TDate, FieldsTextFieldProps>,
    SlotsAndSlotProps<DateFieldSlotsComponent, DateFieldSlotsComponentsProps<TDate>> {}

export type DateFieldOwnerState<TDate> = DateFieldProps<TDate>;

export interface DateFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
}

export interface DateFieldSlotsComponentsProps<TDate> extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<typeof TextField, {}, DateFieldOwnerState<TDate>>;
}
