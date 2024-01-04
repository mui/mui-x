import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { MakeOptional } from '../internals/models/helpers';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import {
  FieldSection,
  TimeValidationError,
  BuiltInFieldTextFieldProps,
  FieldTextFieldVersion,
} from '../models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';

export interface UseTimeFieldProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TTextFieldVersion,
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

export type UseTimeFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseTimeFieldProps<TDate, TTextFieldVersion>> &
  UseTimeFieldProps<TDate, TTextFieldVersion>;

export type TimeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> = UseTimeFieldComponentProps<
  TDate,
  TTextFieldVersion,
  BuiltInFieldTextFieldProps<TTextFieldVersion>
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
  slotProps?: TimeFieldSlotProps<TDate, TTextFieldVersion>;
};

export type TimeFieldOwnerState<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> = TimeFieldProps<TDate, TTextFieldVersion>;

export interface TimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface TimeFieldSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    TimeFieldOwnerState<TDate, TTextFieldVersion>
  >;
}
