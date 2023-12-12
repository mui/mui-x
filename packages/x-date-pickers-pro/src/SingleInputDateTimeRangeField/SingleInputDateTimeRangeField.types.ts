import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { DateRange, RangeFieldSection, UseDateTimeRangeFieldProps } from '../internals/models';
import { DateTimeRangeValidationError } from '../models';

export interface UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseDateTimeRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TUseV6TextField,
        DateTimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputDateTimeRangeFieldProps<
  TDate,
  TUseV6TextField extends boolean = false,
  TChildProps extends {} = FieldsTextFieldProps,
> = Omit<TChildProps, keyof UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>> &
  UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotProps<TDate, TUseV6TextField>;
  };

export interface SingleInputDateTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotProps<TDate, TUseV6TextField extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
