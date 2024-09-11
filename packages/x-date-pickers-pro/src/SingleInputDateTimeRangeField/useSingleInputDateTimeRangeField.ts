import * as React from 'react';
import { useField, useDefaultizedDateTimeField } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, getRangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputDateTimeRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateTimeRangeFieldProps<
    TDate,
    TEnableAccessibleFieldDOMStructure
  >,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    TDate,
    UseSingleInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date-time');

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
    validator: validateDateTimeRange,
    valueType: 'date-time',
  });
};
