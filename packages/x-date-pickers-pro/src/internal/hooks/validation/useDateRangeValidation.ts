import {
  useValidation,
  ValidationProps,
  Validator,
  DateValidationError,
  validateDate,
  ExportedDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid, parseRangeInputValue } from '../../utils/date-utils';
import { DateRange } from '../../models';

export interface DateRangeValidationProps<TInputDate, TDate>
  extends ExportedDateValidationProps<TDate>,
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

  const dateValidations: [DateRangeValidationErrorValue, DateRangeValidationErrorValue] = [
    validateDate({ adapter, value: start, props }),
    validateDate({ adapter, value: end, props }),
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

const isSameDateRangeError = (a: DateRangeValidationError, b: DateRangeValidationError | null) =>
  b !== null && a[1] === b[1] && a[0] === b[0];

export const useDateRangeValidation = <TInputDate, TDate>(
  props: DateRangeValidationProps<TInputDate, TDate>,
): DateRangeValidationError => {
  return useValidation(props, validateDateRange, isSameDateRangeError);
};
