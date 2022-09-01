import {
  useValidation,
  ValidationProps,
  Validator,
  DateValidationError,
  validateDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid, parseRangeInputValue } from '../../utils/date-utils';
import { DateRange, DayRangeValidationProps } from '../../models/dateRange';

export interface DateRangeValidationProps<TInputDate, TDate>
  extends DayRangeValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>>,
    ValidationProps<DateRangeValidationError, DateRange<TInputDate>> {}

export const validateDateRange: Validator<any, DateRangeValidationProps<any, any>> = ({
  props,
  value,
  adapter,
}) => {
  const [start, end] = value;

  // for partial input
  if (start === null || end === null) {
    return [null, null];
  }

  const { shouldDisableDate, ...otherProps } = props;

  const dateValidations: [DateRangeValidationErrorValue, DateRangeValidationErrorValue] = [
    validateDate({
      adapter,
      value: start,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'start'),
      },
    }),
    validateDate({
      adapter,
      value: end,
      props: {
        ...otherProps,
        shouldDisableDate: (day) => !!shouldDisableDate?.(day, 'end'),
      },
    }),
  ];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
  }

  if (!isRangeValid(adapter.utils, parseRangeInputValue(adapter.utils, value))) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

type DateRangeValidationErrorValue = DateValidationError | 'invalidRange' | null;

export type DateRangeValidationError = [
  DateRangeValidationErrorValue,
  DateRangeValidationErrorValue,
];

export const isSameDateRangeError = (
  a: DateRangeValidationError,
  b: DateRangeValidationError | null,
) => b !== null && a[1] === b[1] && a[0] === b[0];

export const useDateRangeValidation = <TInputDate, TDate>(
  props: DateRangeValidationProps<TInputDate, TDate>,
): DateRangeValidationError => {
  return useValidation(props, validateDateRange, isSameDateRangeError);
};
