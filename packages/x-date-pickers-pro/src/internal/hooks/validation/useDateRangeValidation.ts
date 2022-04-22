import {
  useValidation,
  ValidationProps,
  Validator,
  DateValidationProps,
  DateValidationError,
  validateDate,
  ExportedDateValidationProps,
  ParseableDate,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
import { DateRange } from '../../models';

export interface DateRangeValidationProps<TDate, TInputDate extends ParseableDate<TDate>>
  extends ExportedDateValidationProps<TDate>,
    ValidationProps<DateRangeValidationError, DateRange<TInputDate>> {}

export const validateDateRange: Validator<any, DateRangeValidationProps<any, any>> = (
  utils,
  value,
  dateValidationProps,
) => {
  const [start, end] = value;

  // for partial input
  if (start === null || end === null) {
    return [null, null];
  }

  const dateValidations: [DateRangeValidationErrorValue, DateRangeValidationErrorValue] = [
    validateDate(utils, start, dateValidationProps as DateValidationProps<any, any>),
    validateDate(utils, end, dateValidationProps as DateValidationProps<any, any>),
  ];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
  }

  if (!isRangeValid(utils, [utils.date(start), utils.date(end)])) {
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

export const useDateRangeValidation = <TDate, TInputDate extends ParseableDate<TDate>>(
  props: DateRangeValidationProps<TDate, TInputDate>,
): DateRangeValidationError => {
  return useValidation(props, validateDateRange, isSameDateRangeError);
};
