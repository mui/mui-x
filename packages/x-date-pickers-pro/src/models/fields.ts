import * as React from 'react';
import { PickerValue, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { FieldRef, PickerFieldSlotProps } from '@mui/x-date-pickers/models';
import type { UseMultiInputRangeFieldTextFieldProps } from '../hooks/useMultiInputRangeField';

export type { FieldRangeSection } from '@mui/x-date-pickers/internals';

export type FieldType = 'single-input' | 'multi-input';

/**
 * Props the `textField` slot of the multi input field can receive when used inside a picker.
 */
export type MultiInputFieldSlotTextFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = UseMultiInputRangeFieldTextFieldProps<
  TEnableAccessibleFieldDOMStructure,
  { label?: React.ReactNode; focused?: boolean }
>;

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
