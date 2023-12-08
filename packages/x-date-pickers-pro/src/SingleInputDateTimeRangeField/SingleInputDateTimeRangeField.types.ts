import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import {
  FieldSlotsComponents,
  FieldSlotsComponentsProps,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { ExportedUseClearableFieldProps } from '@mui/x-date-pickers/hooks';
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
    slots?: SingleInputDateTimeRangeFieldSlotsComponent;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
  };

export interface SingleInputDateTimeRangeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotsComponentsProps<
  TDate,
  TUseV6TextField extends boolean,
> extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
