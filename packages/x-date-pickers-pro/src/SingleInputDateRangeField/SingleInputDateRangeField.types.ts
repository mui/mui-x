import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { DateRange, UseDateRangeFieldProps } from '../internals/models';
import type { RangeFieldSection, DateRangeValidationError } from '../models';

export interface UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseDateRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TUseV6TextField,
        DateRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputDateRangeFieldProps<TDate, TUseV6TextField extends boolean = false> = Omit<
  BuiltInFieldTextFieldProps<TUseV6TextField>,
  keyof UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField>
> &
  UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotProps<TDate, TUseV6TextField>;
  };

export interface SingleInputDateRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotProps<TDate, TUseV6TextField extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateRangeFieldProps<TDate, TUseV6TextField>
  >;
}
