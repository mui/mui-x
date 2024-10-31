'use client';
import * as React from 'react';
import { useField, useDefaultizedDateField, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { rangeValueManager, getRangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../validation';
import { RangeFieldSection } from '../models';

export const useSingleInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  const fieldValueManager = React.useMemo(
    () => getRangeFieldValueManager({ dateSeparator: internalProps.dateSeparator }),
    [internalProps.dateSeparator],
  );

  return useField<
    PickerRangeValue,
    RangeFieldSection,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: rangeValueManager,
    fieldValueManager,
    validator: validateDateRange,
    valueType: 'date',
  });
};
