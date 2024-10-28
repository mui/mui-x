import { validateTime, Validator } from '@mui/x-date-pickers/validation';
import { BaseTimeValidationProps } from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../internals/utils/date-utils';
import { TimeRangeValidationError, DateRange } from '../models';
import { rangeValueManager } from '../internals/utils/valueManagers';

export interface ValidateTimeRangeProps extends Required<BaseTimeValidationProps> {}

export const validateTimeRange: Validator<
  DateRange<any>,
  any,
  TimeRangeValidationError,
  ValidateTimeRangeProps
> = ({ adapter, value, timezone, props }) => {
  const [start, end] = value;

  const dateTimeValidations: TimeRangeValidationError = [
    validateTime({
      adapter,
      value: start,
      timezone,
      props,
    }),
    validateTime({
      adapter,
      value: end,
      timezone,
      props,
    }),
  ];

  if (dateTimeValidations[0] || dateTimeValidations[1]) {
    return dateTimeValidations;
  }

  // for partial input
  if (start === null || end === null) {
    return [null, null];
  }

  if (!isRangeValid(adapter.utils, value)) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

validateTimeRange.valueManager = rangeValueManager;
