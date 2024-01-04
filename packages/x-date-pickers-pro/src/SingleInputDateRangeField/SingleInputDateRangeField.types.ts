import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { DateRange, UseDateRangeFieldProps } from '../internals/models';
import type { RangeFieldSection, DateRangeValidationError } from '../models';

export interface UseSingleInputDateRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseDateRangeFieldProps<TDate, TTextFieldVersion>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TTextFieldVersion,
        DateRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputDateRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = Omit<
  BuiltInFieldTextFieldProps<TTextFieldVersion>,
  keyof UseSingleInputDateRangeFieldProps<TDate, TTextFieldVersion>
> &
  UseSingleInputDateRangeFieldProps<TDate, TTextFieldVersion> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotProps<TDate, TTextFieldVersion>;
  };

export interface SingleInputDateRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
