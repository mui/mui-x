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
import { ParseableDate } from '../../models/parseableDate';

export interface DateTimeValidationProps<TDate, TInputDate extends ParseableDate<TDate>>
  extends ExportedDateValidationProps<TDate>,
    ExportedTimeValidationProps<TDate>,
    ValidationProps<DateTimeValidationError, TInputDate | null> {}

export const validateDateTime: Validator<any, DateTimeValidationProps<any, any>> = (
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

export function useDateTimeValidation<TDate, TInputDate extends ParseableDate<TDate>>(
  props: DateTimeValidationProps<TDate, TInputDate>,
): DateTimeValidationError {
  return useValidation(props, validateDateTime, isSameDateTimeError);
}
