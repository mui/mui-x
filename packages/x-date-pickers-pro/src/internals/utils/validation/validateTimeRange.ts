import { TimezoneProps } from '@mui/x-date-pickers/models';
import {
  Validator,
  validateTime,
  BaseTimeValidationProps,
  DefaultizedProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../date-utils';
import { TimeRangeValidationError, DateRange } from '../../../models';

export interface TimeRangeComponentValidationProps
  extends Required<BaseTimeValidationProps>,
    DefaultizedProps<TimezoneProps, 'timezone'> {}

export const validateTimeRange: Validator<
  DateRange<any>,
  any,
  TimeRangeValidationError,
  TimeRangeComponentValidationProps
> = ({ props, value, adapter }) => {
  const [start, end] = value;

  const dateTimeValidations: TimeRangeValidationError = [
    validateTime({
      adapter,
      value: start,
      props,
    }),
    validateTime({
      adapter,
      value: end,
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
