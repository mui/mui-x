'use client';
import * as React from 'react';
import { useField, useFieldInternalPropsWithDefaults } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useSplitFieldProps } from '../hooks';
import { getDateValueManager } from '../valueManagers';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const valueManager = React.useMemo(
    () =>
      getDateValueManager({
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
