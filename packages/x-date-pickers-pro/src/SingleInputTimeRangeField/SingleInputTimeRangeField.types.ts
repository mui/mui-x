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
import { DateRange, UseTimeRangeFieldProps } from '../internals/models';
import { RangeFieldSection, TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseTimeRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TUseV6TextField,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputTimeRangeFieldProps<TDate, TUseV6TextField extends boolean = false> = Omit<
  BuiltInFieldTextFieldProps<TUseV6TextField>,
  keyof UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField>
> &
  UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputTimeRangeFieldSlotProps<TDate, TUseV6TextField>;
  };

export interface SingleInputTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotProps<TDate, TUseV6TextField extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
