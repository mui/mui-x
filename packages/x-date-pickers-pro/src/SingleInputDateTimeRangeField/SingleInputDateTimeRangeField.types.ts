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
import { UseDateTimeRangeFieldProps } from '../internals/models';
import { DateRange, RangeFieldSection, DateTimeRangeValidationError } from '../models';

export interface UseSingleInputDateTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseDateTimeRangeFieldProps<TDate, TTextFieldVersion>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TTextFieldVersion,
        DateTimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputDateTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = Omit<
  BuiltInFieldTextFieldProps<TTextFieldVersion>,
  keyof UseSingleInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>
> &
  UseSingleInputDateTimeRangeFieldProps<TDate, TTextFieldVersion> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotProps<TDate, TTextFieldVersion>;
  };

export interface SingleInputDateTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
