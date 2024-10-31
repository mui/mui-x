import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  FieldSection,
  PickerValidDate,
  TimeValidationError,
  BuiltInFieldTextFieldProps,
} from '../models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { ExportedValidateTimeProps } from '../validation/validateTime';
import { AmPmProps } from '../internals/models/props/time';

export interface UseTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        TimeValidationError
      >,
      'format'
    >,
    ExportedValidateTimeProps<TDate>,
    ExportedUseClearableFieldProps,
    AmPmProps {}

export type TimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> =
  // The hook props
  UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
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
      slotProps?: TimeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
    };

export type TimeFieldOwnerState<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = TimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface TimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    TimeFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
