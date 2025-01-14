'use client';
import {
  useField,
  useFieldInternalPropsWithDefaults,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { useDateRangeManager } from '../managers';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateRangeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  return useField<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalPropsWithDefaults
  >({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager: manager.internal_valueManager,
    fieldValueManager: manager.internal_fieldValueManager,
    validator: manager.validator,
    valueType: manager.valueType,
  });
};
