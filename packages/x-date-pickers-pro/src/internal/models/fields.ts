import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { TextFieldProps } from '@mui/material/TextField';
import { StackProps } from '@mui/material/Stack';
import { TypographyProps } from '@mui/material/Typography';
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

/**
 * Props the `textField` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotTextFieldProps {
  inputRef?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  label?: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler;
  onFocus?: React.FocusEventHandler;
  focused?: boolean;
}

/**
 * Props the `root` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotRootProps {
  onBlur?: React.FocusEventHandler;
}

/**
 * Props the multi input field can receive when used inside a picker.
 * Only contains what the MUI component are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export interface BaseMultiInputFieldProps<TValue, TError> extends BaseFieldProps<TValue, TError> {
  slots?: {};
  slotProps?: {
    root?: SlotComponentProps<
      React.ElementType<MultiInputFieldSlotRootProps>,
      {},
      Record<string, any>
    >;
    textField?: SlotComponentProps<
      React.ElementType<MultiInputFieldSlotTextFieldProps>,
      {},
      { position?: 'start' | 'end' } & Record<string, any>
    >;
  };
}
