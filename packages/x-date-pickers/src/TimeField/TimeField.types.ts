import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { MakeOptional } from '@mui/x-internals/types';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { TimeValidationError, BuiltInFieldTextFieldProps } from '../models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { ExportedValidateTimeProps } from '../validation/validateTime';
import { AmPmProps } from '../internals/models/props/time';
import { PickerValue } from '../internals/models';

export interface UseTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, TimeValidationError>,
      'format'
    >,
    ExportedValidateTimeProps,
    ExportedUseClearableFieldProps,
    AmPmProps {}

export type TimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseTimeFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: TimeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: TimeFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
    };

export type TimeFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  TimeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface TimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    TimeFieldOwnerState<TEnableAccessibleFieldDOMStructure>
  >;
}
