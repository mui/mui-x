import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { UseTimeRangeFieldProps } from '../internals/models';
import { RangeFieldSection, TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        PickerRangeValue,
        RangeFieldSection,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputTimeRangeFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
  };

export interface SingleInputTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
  >;
}
