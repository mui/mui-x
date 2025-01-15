import type { MakeRequired } from '@mui/x-internals/types';
import { createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { Validator } from './useValidation';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/models/validation';
import { TimeValidationError } from '../models';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { PickerValue } from '../internals/models';

/**
 * Validation props used by the Time Picker, Time Field and Clock components.
 */
export interface ExportedValidateTimeProps extends BaseTimeValidationProps, TimeValidationProps {}

/**
 * Validation props as received by the validateTime method.
 */
export interface ValidateTimeProps
  extends MakeRequired<ExportedValidateTimeProps, ValidateTimePropsToDefault> {}

/**
 * Name of the props that should be defaulted before being passed to the validateTime method.
 */
export type ValidateTimePropsToDefault = keyof BaseTimeValidationProps;

export const validateTime: Validator<PickerValue, TimeValidationError, ValidateTimeProps> = ({
  adapter,
  value,
  timezone,
  props,
}): TimeValidationError => {
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

validateTime.valueManager = singleItemValueManager;
