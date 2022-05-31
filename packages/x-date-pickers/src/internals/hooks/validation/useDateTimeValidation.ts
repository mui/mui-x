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

export interface DateTimeValidationProps<TInputDate, TDate>
  extends ExportedDateValidationProps<TDate>,
    ExportedTimeValidationProps<TDate>,
    ValidationProps<DateTimeValidationError, TInputDate | null> {}

export const validateDateTime: Validator<any, DateTimeValidationProps<any, any>> = ({
  props,
  value,
  adapter,
}) => {
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

  return validateTime({ adapter, value, props: timeValidationProps });
};

export type DateTimeValidationError = DateValidationError | TimeValidationError;

const isSameDateTimeError = (a: DateTimeValidationError, b: DateTimeValidationError) => a === b;

export function useDateTimeValidation<TInputDate, TDate>(
  props: DateTimeValidationProps<TInputDate, TDate>,
): DateTimeValidationError {
  return useValidation(props, validateDateTime, isSameDateTimeError);
}
