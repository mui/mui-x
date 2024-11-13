'use client';
import * as React from 'react';
import { useField, useFieldInternalPropsWithDefaults } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useSplitFieldProps } from '../hooks';
import { getDateTimeValueManager } from '../valueManagers';

export const useDateTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const valueManager = React.useMemo(
    () => getDateTimeValueManager(props.enableAccessibleFieldDOMStructure),
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
