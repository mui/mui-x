'use client';
import * as React from 'react';
import { useField, useFieldInternalPropsWithDefaults } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { useSplitFieldProps } from '../hooks';
import { getTimeValueManager } from '../valueManagers';

export const useTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const valueManager = React.useMemo(
    () =>
      getTimeValueManager({
        enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
      }),
    [props.enableAccessibleFieldDOMStructure],
  );

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    valueManager,
    internalProps,
  });

  return useField<
    false,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalPropsWithDefaults
  >({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager: valueManager.legacyValueManager,
    fieldValueManager: valueManager.fieldValueManager,
    validator: valueManager.validator,
    valueType: valueManager.valueType,
  });
};
