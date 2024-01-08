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
import { UseTimeRangeFieldProps } from '../internals/models';
import { DateRange, RangeFieldSection, TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseTimeRangeFieldProps<TDate, TTextFieldVersion>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TTextFieldVersion,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = Omit<
  BuiltInFieldTextFieldProps<TTextFieldVersion>,
  keyof UseSingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>
> &
  UseSingleInputTimeRangeFieldProps<TDate, TTextFieldVersion> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputTimeRangeFieldSlotProps<TDate, TTextFieldVersion>;
  };

export interface SingleInputTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
