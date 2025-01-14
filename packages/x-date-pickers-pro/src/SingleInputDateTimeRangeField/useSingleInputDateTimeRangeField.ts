'use client';
import {
  useField,
  useFieldInternalPropsWithDefaults,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { useDateTimeRangeManager } from '../managers';

export const useSingleInputDateTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useDateTimeRangeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date-time');
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
