import * as React from 'react';
import { createIsAfterIgnoreDatePart } from '../../../utils/time-utils';
import { PickersTimezone, PickerValidDate, TimeView } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { ValidateTimeProps } from '../../../../validation';
import {
  startOfHour,
  endOfHour,
  startOfMinute,
  endOfMinute,
} from '../../utils/future-adapter-methods';

// TODO: Add prop?
const disableIgnoringDatePartForTimeValidation = false;
const shouldCheckPastEnd = true; // section === 'hour' || (section === 'minute' && sections.includes('second'));

export function useIsOptionInvalid(parameters: useIsOptionInvalid.Parameters) {
  const { validationProps, timezone } = parameters;

  const utils = useUtils();

  return React.useCallback(
    (time: PickerValidDate, precision: 'hour' | 'minute' | 'second') => {
      if (validationProps?.shouldDisableTime?.(time, convertPrecisionToLegacyView(precision))) {
        return true;
      }

      const containsValidTime = ([start, end]: [PickerValidDate, PickerValidDate]) => {
        const now = utils.date(undefined, timezone);
        const isAfter = createIsAfterIgnoreDatePart(
          disableIgnoringDatePartForTimeValidation,
          utils,
        );

        if (validationProps.minTime != null && isAfter(validationProps.minTime, end)) {
          return false;
        }

        if (validationProps.maxTime != null && isAfter(start, validationProps.maxTime)) {
          return false;
        }

        if (validationProps.disableFuture && isAfter(start, now)) {
          return false;
        }

        if (validationProps.disablePast && isAfter(now, shouldCheckPastEnd ? end : start)) {
          return false;
        }

        return true;
      };

      switch (precision) {
        case 'hour': {
          return !containsValidTime([startOfHour(utils, time), endOfHour(utils, time)]);
        }

        case 'minute': {
          return (
            utils.getMinutes(time) % (validationProps.minutesStep ?? 1) !== 0 ||
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
    [utils, validationProps, timezone],
  );
}

export namespace useIsOptionInvalid {
  export interface Parameters {
    validationProps: ValidateTimeProps;
    timezone: PickersTimezone;
  }
}

// TODO: Rename the view in the validation props and remove this function
function convertPrecisionToLegacyView(precision: 'hour' | 'minute' | 'second'): TimeView {
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
