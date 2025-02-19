import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotComponentProps } from '@mui/utils';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickerOwnerState, FieldOwnerState } from '@mui/x-date-pickers/models';
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '@mui/x-date-pickers/hooks';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { RangePosition, PickerRangeFieldSlotProps } from '../../models';

export interface RangePickerFieldSlots extends UseClearableFieldSlots {
  field: React.ElementType;
  /**
   * Element rendered at the root.
   * Ignored if the field has only one input.
   */
  fieldRoot?: React.ElementType<StackProps>;
  /**
   * Element rendered between the two inputs.
   * Ignored if the field has only one input.
   */
  fieldSeparator?: React.ElementType<TypographyProps>;
  /**
   * Form control with an input to render a date or time inside the default field.
   * It is rendered twice: once for the start element and once for the end element.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  field?: SlotComponentPropsFromProps<
    PickerRangeFieldSlotProps<TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, FieldOwnerState>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, FieldOwnerState>;
  textField?: SlotComponentProps<
    typeof PickersTextField,
    {},
    FieldOwnerState & { position?: RangePosition }
  >;
}
