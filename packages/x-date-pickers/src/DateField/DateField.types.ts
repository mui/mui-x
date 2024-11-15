import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { MakeOptional } from '@mui/x-internals/types';
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
import { ExportedValidateDateProps } from '../validation/validateDate';

export interface UseDateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateValidationError
      >,
      'format'
    >,
    ExportedValidateDateProps,
    ExportedUseClearableFieldProps {}

export type DateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseDateFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateFieldProps<TEnableAccessibleFieldDOMStructure>
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
      slotProps?: DateFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
    };

export type DateFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  DateFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateFieldOwnerState<TEnableAccessibleFieldDOMStructure>
  >;
}
