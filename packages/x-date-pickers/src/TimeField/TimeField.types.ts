import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import { FieldsTextFieldProps } from '../internals/models/fields';
import { FieldSection, TimeValidationError } from '../models';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '../internals';
import { ExportedUseClearableFieldProps } from '../hooks/useClearableField';

export interface UseTimeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TUseV6TextField,
        TimeValidationError
      >,
      'format'
    >,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps,
    ExportedUseClearableFieldProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseTimeFieldDefaultizedProps<TDate, TUseV6TextField extends boolean> = DefaultizedProps<
  UseTimeFieldProps<TDate, TUseV6TextField>,
  keyof BaseTimeValidationProps | 'format'
>;

export type UseTimeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseTimeFieldProps<TDate, TUseV6TextField>> &
  UseTimeFieldProps<TDate, TUseV6TextField>;

export interface TimeFieldProps<TDate, TUseV6TextField extends boolean = false>
  extends UseTimeFieldComponentProps<TDate, TUseV6TextField, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TimeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
}

export type TimeFieldOwnerState<TDate, TUseV6TextField extends boolean> = TimeFieldProps<
  TDate,
  TUseV6TextField
>;

export interface TimeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<typeof TextField, {}, TimeFieldOwnerState<TDate, TUseV6TextField>>;
}
