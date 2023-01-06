import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { BaseFieldProps, FieldSection } from '@mui/x-date-pickers/internals';

export interface RangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}

export interface RangeFieldSectionWithoutPosition
  extends Omit<RangeFieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'> {}

type BaseMultiInputFieldSlots = {
  root?: React.ElementType<StackProps>;
  textField?: React.ElementType<TextFieldProps>;
  separator?: React.ElementType<TypographyProps>;
};

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

export interface BaseMultiInputFieldProps<TValue, TError>
  extends Omit<
    BaseFieldProps<TValue, TError>,
    'components' | 'componentsProps' | 'slots' | 'slotsProps'
  > {
  /**
   * @deprecated
   */
  components?: BaseMultiInputFieldSlotsComponent;
  /**
   * @deprecated
   */
  componentsProps?: BaseMultiInputFieldSlotsComponentsProps;
  slots?: BaseMultiInputFieldSlots;
  slotsProps?: BaseMultiInputFieldSlotsComponentsProps;
}
