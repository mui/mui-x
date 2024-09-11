import * as React from 'react';
import { useField, useDefaultizedTimeField } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { rangeValueManager, getRangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateTimeRange } from '../internals/utils/validation/validateTimeRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputTimeRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseSingleInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  const fieldValueManager = React.useMemo(
    () => getRangeFieldValueManager<TDate>({ dateSeparator: internalProps.dateSeparator }),
    [internalProps.dateSeparator],
  );

  return useField<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
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
