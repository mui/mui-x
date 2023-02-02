import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import {
  BaseFieldProps,
  FieldSection,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
export interface RangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}

export interface RangeFieldSectionWithoutPosition
  extends Omit<RangeFieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'> {}

type BaseMultiInputFieldSlotsComponent = {
  Root?: React.ElementType<StackProps>;
  TextField?: React.ElementType<TextFieldProps>;
  Separator?: React.ElementType<TypographyProps>;
};

type BaseMultiInputFieldSlotsComponentsProps = {
  root?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    { position?: 'start' | 'end' } & Record<string, any>
  >;
  separator?: SlotComponentProps<typeof Typography, {}, Record<string, any>>;
};

/**
 * Props the multi input field can receive when used inside a picker.
 * Do not take into account props that would be passed directly through `props.slotProps.field`.
 */
export interface BaseMultiInputFieldProps<TValue, TError> extends BaseFieldProps<TValue, TError> {
  slots?: UncapitalizeObjectKeys<BaseMultiInputFieldSlotsComponent>;
  slotProps?: BaseMultiInputFieldSlotsComponentsProps;
}
