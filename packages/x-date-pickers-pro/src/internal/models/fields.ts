import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { BaseFieldProps } from '@mui/x-date-pickers/internals';

export interface BaseMultiInputFieldProps<TValue, TError>
  extends Omit<BaseFieldProps<TValue, TError>, 'components' | 'componentsProps'> {
  components?: {
    Root?: React.ElementType<StackProps>;
    Input?: React.ElementType<TextFieldProps>;
    Separator?: React.ElementType<TypographyProps>;
  };
  componentsProps?: {
    root?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
    input?: SlotComponentProps<
      typeof TextField,
      {},
      { position?: 'start' | 'end' } & Record<string, any>
    >;
    separator?: SlotComponentProps<typeof Typography, {}, Record<string, any>>;
  };
}
