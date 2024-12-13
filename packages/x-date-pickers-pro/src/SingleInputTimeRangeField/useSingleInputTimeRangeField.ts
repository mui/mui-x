'use client';
import * as React from 'react';
import { useField, useDefaultizedTimeField, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { rangeValueManager, getRangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../validation';

export const useSingleInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  const fieldValueManager = React.useMemo(
    () => getRangeFieldValueManager({ dateSeparator: internalProps.dateSeparator }),
    [internalProps.dateSeparator],
  );

  return useField<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: rangeValueManager,
    fieldValueManager,
    validator: validateTimeRange,
    valueType: 'time',
  });
};
