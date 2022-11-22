import { createIsAfterIgnoreDatePart } from '../../utils/time-utils';
import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  BaseTimeValidationProps,
  CommonDateTimeValidationError,
  TimeValidationProps,
} from './models';

export interface TimeComponentValidationProps<TDate>
  extends Required<BaseTimeValidationProps>,
    TimeValidationProps<TDate> {}

export type TimeValidationError =
  | CommonDateTimeValidationError
  | 'minutesStep'
  | 'minTime'
  | 'maxTime'
  | 'shouldDisableTime-hours'
  | 'shouldDisableTime-minutes'
  | 'shouldDisableTime-seconds';

export const validateTime: Validator<
  any | null,
  any,
  TimeValidationError,
  TimeComponentValidationProps<any>
> = ({ adapter, value, props }): TimeValidationError => {
  const {
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation = false,
    disablePast,
    disableFuture,
  } = props;

  const now = adapter.utils.date()!;
  const date = adapter.utils.date(value);
  const isAfter = createIsAfterIgnoreDatePart(
    disableIgnoringDatePartForTimeValidation,
    adapter.utils,
  );

  if (value === null) {
    return null;
  }

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(minTime && isAfter(minTime, value)):
      return 'minTime';

    case Boolean(maxTime && isAfter(value, maxTime)):
      return 'maxTime';

    case Boolean(disableFuture && adapter.utils.isAfter(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && adapter.utils.isBefore(date, now)):
      return 'disablePast';

    case Boolean(shouldDisableTime && shouldDisableTime(adapter.utils.getHours(value), 'hours')):
      return 'shouldDisableTime-hours';

    case Boolean(
      shouldDisableTime && shouldDisableTime(adapter.utils.getMinutes(value), 'minutes'),
    ):
      return 'shouldDisableTime-minutes';

    case Boolean(
      shouldDisableTime && shouldDisableTime(adapter.utils.getSeconds(value), 'seconds'),
    ):
      return 'shouldDisableTime-seconds';

    case Boolean(minutesStep && adapter.utils.getMinutes(value) % minutesStep !== 0):
      return 'minutesStep';

    default:
      return null;
  }
};

/**
 * TODO v6: Remove
 */
export const isSameTimeError = (a: unknown, b: unknown) => a === b;

/**
 * TODO v6: Remove
 */
export const useTimeValidation = <TDate>(
  props: ValidationProps<TimeValidationError, TDate | null, TimeComponentValidationProps<TDate>>,
): TimeValidationError => useValidation(props, validateTime, isSameTimeError, null);
