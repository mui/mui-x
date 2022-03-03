import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  validateDate,
  DateValidationError,
  ExportedDateValidationProps,
} from './useDateValidation';
import {
  validateTime,
  TimeValidationError,
  ExportedTimeValidationProps,
} from './useTimeValidation';

export interface DateTimeValidationProps<TDate>
  extends ExportedDateValidationProps<TDate>,
    ExportedTimeValidationProps<TDate>,
    ValidationProps<DateTimeValidationError, TDate> {}

export const validateDateTime: Validator<any, DateTimeValidationProps<any>> = (
  utils,
  value,
  { minDate, maxDate, disableFuture, shouldDisableDate, disablePast, ...timeValidationProps },
) => {
  const dateValidationResult = validateDate(utils, value, {
    minDate,
    maxDate,
    disableFuture,
    shouldDisableDate,
    disablePast,
  });

  if (dateValidationResult !== null) {
    return dateValidationResult;
  }

  return validateTime(utils, value, timeValidationProps);
};

export type DateTimeValidationError = DateValidationError | TimeValidationError;

const isSameDateTimeError = (a: DateTimeValidationError, b: DateTimeValidationError) => a === b;

export function useDateTimeValidation<TDate>(
  props: DateTimeValidationProps<TDate> & ValidationProps<DateTimeValidationError, TDate>,
): DateTimeValidationError {
  return useValidation(props, validateDateTime, isSameDateTimeError);
}
