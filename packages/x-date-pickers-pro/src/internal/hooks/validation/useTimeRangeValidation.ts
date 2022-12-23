import {
  useValidation,
  Validator,
  TimeValidationError,
  validateTime,
  BaseTimeValidationProps,
  ValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
import { DateRange } from '../../models/range';
import { rangeValueManager } from '../../utils/valueManagers';

export interface TimeRangeComponentValidationProps extends Required<BaseTimeValidationProps> {}

export const validateTimeRange: Validator<
  DateRange<any>,
  any,
  TimeRangeValidationError,
  TimeRangeComponentValidationProps
> = ({ props, value, adapter }) => {
  const [start, end] = value;

  const dateTimeValidations: [TimeRangeValidationErrorValue, TimeRangeValidationErrorValue] = [
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

type TimeRangeValidationErrorValue = TimeValidationError | 'invalidRange' | null;

export type TimeRangeValidationError = [
  TimeRangeValidationErrorValue,
  TimeRangeValidationErrorValue,
];

export const useDateRangeValidation = <TDate>(
  props: ValidationProps<
    TimeRangeValidationError,
    DateRange<TDate>,
    TimeRangeComponentValidationProps
  >,
): TimeRangeValidationError => {
  return useValidation(
    props,
    validateTimeRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );
};
