'use client';
import * as React from 'react';
import { useField, useFieldInternalPropsWithDefaults } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { getDateRangeValueManager } from '../valueManagers';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const valueManager = React.useMemo(
    () =>
      getDateRangeValueManager({
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

  return useField({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager: valueManager.legacyValueManager,
    fieldValueManager: valueManager.fieldValueManager,
    validator: valueManager.validator,
    valueType: valueManager.valueType,
  });
};
