import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { DateValidationError, FieldSection, BuiltInFieldTextFieldProps } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';

export interface UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateValidationError
      >,
      'format'
    >,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    ExportedUseClearableFieldProps {}

export type UseDateFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>> &
  UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export type DateFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = UseDateFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure,
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>
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
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = DateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
