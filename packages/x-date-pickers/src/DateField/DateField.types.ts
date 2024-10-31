import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import {
  DateValidationError,
  FieldSection,
  PickerValidDate,
  BuiltInFieldTextFieldProps,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import { ExportedValidateDateProps } from '../validation/validateDate';

export interface UseDateFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateValidationError
      >,
      'format'
    >,
    ExportedValidateDateProps<TDate>,
    ExportedUseClearableFieldProps {}

export type DateFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> =
  // The hook props
  UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
    > & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: DateFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: DateFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
    };

export type DateFieldOwnerState<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = DateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
