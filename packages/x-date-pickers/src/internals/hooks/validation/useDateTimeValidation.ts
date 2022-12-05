import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  validateDate,
  DateValidationError,
  DateComponentValidationProps,
} from './useDateValidation';
import {
  validateTime,
  TimeValidationError,
  TimeComponentValidationProps,
} from './useTimeValidation';

export interface DateTimeComponentValidationProps<TDate>
  extends DateComponentValidationProps<TDate>,
    TimeComponentValidationProps<TDate> {}

export const validateDateTime: Validator<
  any | null,
  any,
  DateTimeValidationError,
  DateTimeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const dateValidationResult = validateDate({
    adapter,
    value,
    props,
  });

  if (dateValidationResult !== null) {
    return dateValidationResult;
  }

  return validateTime({
    adapter,
    value,
    props,
  });
};

export type DateTimeValidationError = DateValidationError | TimeValidationError;

/**
 * TODO v6: Remove
 */
export const isSameDateTimeError = (a: DateTimeValidationError, b: DateTimeValidationError) =>
  a === b;

/**
 * TODO v6: Remove
 */
export function useDateTimeValidation<TDate>(
  props: ValidationProps<
    DateTimeValidationError,
    TDate | null,
    DateTimeComponentValidationProps<TDate>
  >,
): DateTimeValidationError {
  return useValidation(props, validateDateTime, isSameDateTimeError, null);
}
