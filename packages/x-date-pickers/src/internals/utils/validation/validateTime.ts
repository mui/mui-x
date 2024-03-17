import { createIsAfterIgnoreDatePart } from '../time-utils';
import { Validator } from '../../hooks/useValidation';
import { BaseTimeValidationProps, TimeValidationProps } from '../../models/validation';
import { PickerValidDate, TimeValidationError, TimezoneProps } from '../../../models';
import { DefaultizedProps } from '../../models/helpers';

export interface TimeComponentValidationProps<TDate extends PickerValidDate>
  extends Required<BaseTimeValidationProps>,
    TimeValidationProps<TDate>,
    DefaultizedProps<TimezoneProps, 'timezone'> {}

export const validateTime: Validator<
  any | null,
  any,
  TimeValidationError,
  TimeComponentValidationProps<any>
> = ({ adapter, value, props }): TimeValidationError => {
  if (value === null) {
    return null;
  }

  const {
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation = false,
    disablePast,
    disableFuture,
    timezone,
  } = props;

  const now = adapter.utils.date(undefined, timezone);
  const isAfter = createIsAfterIgnoreDatePart(
    disableIgnoringDatePartForTimeValidation,
    adapter.utils,
  );

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(minTime && isAfter(minTime, value)):
      return 'minTime';

    case Boolean(maxTime && isAfter(value, maxTime)):
      return 'maxTime';

    case Boolean(disableFuture && adapter.utils.isAfter(value, now)):
      return 'disableFuture';

    case Boolean(disablePast && adapter.utils.isBefore(value, now)):
      return 'disablePast';

    case Boolean(shouldDisableTime && shouldDisableTime(value, 'hours')):
      return 'shouldDisableTime-hours';

    case Boolean(shouldDisableTime && shouldDisableTime(value, 'minutes')):
      return 'shouldDisableTime-minutes';

    case Boolean(shouldDisableTime && shouldDisableTime(value, 'seconds')):
      return 'shouldDisableTime-seconds';

    case Boolean(minutesStep && adapter.utils.getMinutes(value) % minutesStep !== 0):
      return 'minutesStep';

    default:
      return null;
  }
};
