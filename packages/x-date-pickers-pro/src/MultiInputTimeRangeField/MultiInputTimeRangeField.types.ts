import * as React from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import type { StackProps } from '@mui/material/Stack';
import type { TextFieldProps } from '@mui/material/TextField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { UseTimeRangeFieldProps } from '../internals/models/timeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { MultiInputFieldRefs, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputTimeRangeFieldParams<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
      UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {}

export type UseMultiInputTimeRangeFieldComponentProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>> &
  UseMultiInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface MultiInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends UseMultiInputTimeRangeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure,
    Omit<StackProps, 'position'>
  > {
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MultiInputRangeFieldClasses>;
  /**
   * Overridable slots.
   * @default {}
   */
  slots?: MultiInputTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputTimeRangeFieldSlotProps;
}

export interface MultiInputTimeRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputTimeRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a time.
   * It is rendered twice: once for the start time and once for the end time.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputTimeRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputTimeRangeFieldSlotProps {
  root?: SlotComponentPropsFromProps<StackProps, {}, FieldOwnerState>;
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentPropsFromProps<TypographyProps, {}, FieldOwnerState>;
}
