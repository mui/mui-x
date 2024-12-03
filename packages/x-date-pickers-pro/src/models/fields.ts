import * as React from 'react';
import {
  UseFieldResponse,
  FormProps,
  PickerValue,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { FieldRef, PickerFieldSlotProps } from '@mui/x-date-pickers/models';
import { UseClearableFieldResponse } from '@mui/x-date-pickers/hooks';

export type { FieldRangeSection } from '@mui/x-date-pickers/internals';

export type FieldType = 'single-input' | 'multi-input';

/**
 * Props the `textField` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotTextFieldProps extends FormProps {
  label?: React.ReactNode;
  id?: string;
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  focused?: boolean;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

/**
 * Props the `root` slot of the multi input field can receive when used inside a picker.
 */
export interface MultiInputFieldSlotRootProps {
  onBlur?: React.FocusEventHandler;
}

export interface MultiInputFieldRefs {
  unstableStartFieldRef?: React.Ref<FieldRef<PickerValue>>;
  unstableEndFieldRef?: React.Ref<FieldRef<PickerValue>>;
}

export interface RangeFieldSeparatorProps {
  /**
   * String displayed between the start and the end dates.
   * @default "–"
   */
  dateSeparator?: string;
}

/**
 * Props the `slotProps.field` of a range picker component can receive.
 */
export type PickerRangeFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean> =
  PickerFieldSlotProps<PickerRangeValue, TEnableAccessibleFieldDOMStructure> &
    RangeFieldSeparatorProps;

/**
 * Props the text field receives when used with a multi input picker.
 * Only contains what the MUI components are passing to the text field, not what users can pass using the `props.slotProps.textField`.
 */
export type BaseMultiInputPickersTextFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> = UseClearableFieldResponse<
  UseFieldResponse<TEnableAccessibleFieldDOMStructure, MultiInputFieldSlotTextFieldProps>
>;
