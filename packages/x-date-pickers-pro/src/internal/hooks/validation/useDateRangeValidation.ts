import {
  useValidation,
  ValidationProps,
  Validator,
  DateValidationProps,
  DateValidationError,
  validateDate,
  ExportedDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
import { RangeInput } from '../../models';

export interface DateRangeValidationProps<TDate>
  extends ExportedDateValidationProps<TDate>,
    ValidationProps<DateRangeValidationError, RangeInput<TDate>> {}

export const validateDateRange: Validator<any, DateRangeValidationProps<any>> = (
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
    validateDate(utils, start, dateValidationProps as DateValidationProps<any>),
    validateDate(utils, end, dateValidationProps as DateValidationProps<any>),
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

export const useDateRangeValidation = <TDate>(
  props: DateRangeValidationProps<TDate>,
): DateRangeValidationError => {
  return useValidation(props, validateDateRange, isSameDateRangeError);
};
