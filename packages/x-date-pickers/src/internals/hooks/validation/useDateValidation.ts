import { useValidation, ValidationProps, Validator } from './useValidation';

export interface ExportedDateValidationProps<TDate> {
  /**
   * Disable past dates.
   * @default false
   */
  disablePast?: boolean;
  /**
   * Disable future dates.
   * @default false
   */
  disableFuture?: boolean;
  /**
   * Max selectable date. @DateIOType
   */
  maxDate?: TDate;
  /**
   * Min selectable date. @DateIOType
   */
  minDate?: TDate;
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} Return `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate) => boolean;
}

export interface DateValidationProps<TInputDate, TDate>
  extends ValidationProps<DateValidationError, TInputDate | null>,
    ExportedDateValidationProps<TDate> {}

export type DateValidationError =
  | 'invalidDate'
  | 'shouldDisableDate'
  | 'disableFuture'
  | 'disablePast'
  | 'minDate'
  | 'maxDate'
  | null;

export const validateDate: Validator<any, DateValidationProps<any, any>> = (
  utils,
  value,
  { disablePast, disableFuture, minDate, maxDate, shouldDisableDate },
): DateValidationError => {
  const now = utils.date()!;
  const date = utils.date(value);

  if (date === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};

const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b;

export const useDateValidation = <TInputDate, TDate>(
  props: DateValidationProps<TInputDate, TDate>,
): DateValidationError => useValidation(props, validateDate, isSameDateError);
