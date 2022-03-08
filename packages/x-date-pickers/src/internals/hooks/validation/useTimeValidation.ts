import { createIsAfterIgnoreDatePart } from '../../utils/time-utils';
import { useValidation, ValidationProps, Validator } from './useValidation';
import { ClockPickerView } from '../../models';

export interface ExportedTimeValidationProps<TDate> {
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime?: TDate;
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime?: TDate;
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} clockType The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime?: (timeValue: number, clockType: ClockPickerView) => boolean;
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation?: boolean;
}

export interface TimeValidationProps<TDate>
  extends ExportedTimeValidationProps<TDate>,
    ValidationProps<TimeValidationError, TDate> {}

export type TimeValidationError =
  | 'invalidDate'
  | 'minTime'
  | 'maxTime'
  | 'shouldDisableTime-hours'
  | 'shouldDisableTime-minutes'
  | 'shouldDisableTime-seconds'
  | null;

export const validateTime: Validator<any, TimeValidationProps<any>> = (
  utils,
  value,
  { minTime, maxTime, shouldDisableTime, disableIgnoringDatePartForTimeValidation },
): TimeValidationError => {
  const date = utils.date(value);
  const isAfterComparingFn = createIsAfterIgnoreDatePart(
    Boolean(disableIgnoringDatePartForTimeValidation),
    utils,
  );

  if (value === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(minTime && isAfterComparingFn(minTime, date!)):
      return 'minTime';

    case Boolean(maxTime && isAfterComparingFn(date!, maxTime)):
      return 'maxTime';

    case Boolean(shouldDisableTime && shouldDisableTime(utils.getHours(date!), 'hours')):
      return 'shouldDisableTime-hours';

    case Boolean(shouldDisableTime && shouldDisableTime(utils.getMinutes(date!), 'minutes')):
      return 'shouldDisableTime-minutes';

    case Boolean(shouldDisableTime && shouldDisableTime(utils.getSeconds(date!), 'seconds')):
      return 'shouldDisableTime-seconds';

    default:
      return null;
  }
};

const isSameTimeError = (a: unknown, b: unknown) => a === b;

export const useTimeValidation = <TDate>(
  props: TimeValidationProps<TDate> & ValidationProps<TimeValidationError, TDate>,
): TimeValidationError => useValidation(props, validateTime, isSameTimeError);
