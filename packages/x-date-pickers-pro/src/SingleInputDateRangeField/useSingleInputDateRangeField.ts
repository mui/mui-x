import * as React from 'react';
import {
  useField,
  splitFieldInternalAndForwardedProps,
  useDefaultizedDateField,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { rangeValueManager, getRangeFieldValueManager } from '../internals/utils/valueManagers';
import { validateDateRange } from '../internals/utils/validation/validateDateRange';
import { RangeFieldSection, DateRange } from '../models';

export const useSingleInputDateRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    TDate,
    UseSingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseSingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >(props, 'date');

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
    validator: validateDateRange,
    valueType: 'date',
  });
};
