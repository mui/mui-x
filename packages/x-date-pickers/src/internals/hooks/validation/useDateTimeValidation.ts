import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  validateDate,
  DateValidationError,
  DateComponentDefaultizedValidationProps,
} from './useDateValidation';
import {
  validateTime,
  TimeValidationError,
  TimeComponentValidationProps,
} from './useTimeValidation';

export interface DateTimeComponentValidationProps<TDate>
  extends DateComponentDefaultizedValidationProps<TDate>,
    TimeComponentValidationProps<TDate> {}

export const validateDateTime: Validator<
  any | null,
  any,
  DateTimeValidationError,
  DateTimeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const {
    minDate,
    maxDate,
    disableFuture,
    shouldDisableDate,
    disablePast,
    ...timeValidationProps
  } = props;

  const dateValidationResult = validateDate({
    adapter,
    value,
    props: {
      minDate,
      maxDate,
      disableFuture,
      shouldDisableDate,
      disablePast,
    },
  });

  if (dateValidationResult !== null) {
    return dateValidationResult;
  }

  return validateTime({
    adapter,
    value,
    props: { ...timeValidationProps, disablePast, disableFuture },
  });
};

export type DateTimeValidationError = DateValidationError | TimeValidationError;

const isSameDateTimeError = (a: DateTimeValidationError, b: DateTimeValidationError) => a === b;

export function useDateTimeValidation<TDate>(
  props: ValidationProps<
    DateTimeValidationError,
    TDate | null,
    DateTimeComponentValidationProps<TDate>
  >,
): DateTimeValidationError {
  return useValidation(props, validateDateTime, isSameDateTimeError);
}
