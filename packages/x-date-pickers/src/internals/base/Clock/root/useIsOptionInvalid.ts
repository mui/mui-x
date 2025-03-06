import * as React from 'react';
import { createIsAfterIgnoreDatePart } from '../../../utils/time-utils';
import { PickerValidDate, TimeView } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { ValidateTimeProps } from '../../../../validation';
import {
  startOfHour,
  endOfHour,
  startOfMinute,
  endOfMinute,
  startOfMeridiem,
  endOfMeridiem,
} from '../../utils/future-adapter-methods';
import { ClockPrecision } from '../utils/types';

// TODO: Add prop?
export const disableIgnoringDatePartForTimeValidation = false;

export function useIsOptionInvalid(parameters: useIsOptionInvalid.Parameters) {
  const utils = useUtils();

  return React.useCallback(
    (time: PickerValidDate, precision: ClockPrecision) => {
      if (parameters?.shouldDisableTime?.(time, convertPrecisionToLegacyView(precision))) {
        return true;
      }

      const containsValidTime = ([start, end]: [PickerValidDate, PickerValidDate]) => {
        const isAfter = createIsAfterIgnoreDatePart(
          disableIgnoringDatePartForTimeValidation,
          utils,
        );

        if (parameters.minTime != null && isAfter(parameters.minTime, end)) {
          return false;
        }

        if (parameters.maxTime != null && isAfter(start, parameters.maxTime)) {
          return false;
        }

        return true;
      };

      switch (precision) {
        case 'meridiem': {
          return !containsValidTime([startOfMeridiem(utils, time), endOfMeridiem(utils, time)]);
        }

        case 'hour': {
          return !containsValidTime([startOfHour(utils, time), endOfHour(utils, time)]);
        }

        case 'minute': {
          return (
            utils.getMinutes(time) % (parameters.minutesStep ?? 1) !== 0 ||
            !containsValidTime([startOfMinute(utils, time), endOfMinute(utils, time)])
          );
        }

        case 'second': {
          return !containsValidTime([time, time]);
        }

        default:
          throw new Error('not supported');
      }
    },
    [utils, parameters],
  );
}

export namespace useIsOptionInvalid {
  export interface Parameters extends Omit<ValidateTimeProps, 'disableFuture' | 'disablePast'> {}
}

// TODO: Rename the view in the validation props and remove this function
function convertPrecisionToLegacyView(precision: ClockPrecision): TimeView {
  switch (precision) {
    case 'hour':
      return 'hours';
    case 'minute':
      return 'minutes';
    case 'second':
      return 'seconds';
    default:
      throw new Error('not supported');
  }
}
