'use client';
import { useField, useFieldInternalPropsWithDefaults } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { useSplitFieldProps } from '../hooks';
import { useTimeManager } from '../managers';
import { PickerValue } from '../internals/models';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeManager(props);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  return useField<
    PickerValue,
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
