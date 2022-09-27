import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/hooks/validation/models';

export interface UseTimeFieldParams<TDate, TChildProps extends {}> {
  props: UseTimeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseTimeFieldProps<TDate>
  extends MakeOptional<UseFieldInternalProps<TDate | null, TimeValidationError>, 'format'>,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseTimeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseTimeFieldProps<TDate>,
  'disableFuture' | 'disablePast' | 'format'
>;

export type UseTimeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseTimeFieldProps<TDate>
> &
  UseTimeFieldProps<TDate>;

export interface TimeFieldProps<TDate> extends UseTimeFieldComponentProps<TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: TimeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: TimeFieldSlotsComponentsProps<TDate>;
}

export type TimeFieldOwnerState<TDate> = TimeFieldProps<TDate>;

export interface TimeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface TimeFieldSlotsComponentsProps<TDate> {
  input?: SlotComponentProps<typeof TextField, {}, TimeFieldOwnerState<TDate>>;
}
