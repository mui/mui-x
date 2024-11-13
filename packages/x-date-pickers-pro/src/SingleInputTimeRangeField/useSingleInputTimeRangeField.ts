'use client';
import * as React from 'react';
import { useField, useFieldInternalPropsWithDefaults } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { getTimeRangeValueManager } from '../valueManagers';

export const useSingleInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const valueManager = React.useMemo(
    () =>
      getTimeRangeValueManager({
        enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
        dateSeparator: props.dateSeparator,
      }),
    [props.enableAccessibleFieldDOMStructure, props.dateSeparator],
  );

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    valueManager,
    internalProps,
  });

  return useField<
    true,
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
