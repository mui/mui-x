// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import {
  dateRangeFieldValueManager,
  useDefaultizedDateRangeFieldProps,
} from '../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from './MultiInputDateRangeField.types';

import { useMultiInputRangeField } from '../internal/hooks/useMultiInputRangeField';
import { UseSingleInputDateRangeFieldDefaultizedProps } from '../SingleInputDateRangeField/SingleInputDateRangeField.types';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import {
  DateRangeComponentValidationProps,
  DateRangeValidationError,
  validateDateRange,
} from '../internal/hooks/validation/useDateRangeValidation';

export const useMultiInputDateRangeField = <TDate, TChildProps extends {}>(
  params: UseMultiInputDateRangeFieldParams<TDate, TChildProps>,
) => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, TChildProps>(params.sharedProps);

  return useMultiInputRangeField<
    TDate,
    DateRangeValidationError,
    DateRangeComponentValidationProps<TDate>,
    UseSingleInputDateRangeFieldDefaultizedProps<TDate> & TChildProps,
    TChildProps
  >(
    { ...params, sharedProps },
    validateDateRange,
    dateRangePickerValueManager,
    dateRangeFieldValueManager,
  );
};
