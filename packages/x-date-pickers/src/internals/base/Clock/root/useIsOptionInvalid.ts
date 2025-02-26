import * as React from 'react';
import { createIsAfterIgnoreDatePart } from '../../../utils/time-utils';
import { PickersTimezone, PickerValidDate, TimeView } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { ValidateTimeProps } from '../../../../validation';

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
        // TODO: Add utils.startOfHour and utils.endOfHour
        case 'hour': {
          return !containsValidTime([
            utils.setSeconds(utils.setMinutes(time, 0), 0),
            utils.setSeconds(utils.setMinutes(time, 59), 59),
          ]);
        }

        // TODO: Add utils.startOfMinute and utils.endOfMinute
        case 'minute': {
          return (
            utils.getMinutes(time) % (validationProps.minutesStep ?? 1) !== 0 ||
            !containsValidTime([utils.setSeconds(time, 0), utils.setSeconds(time, 59)])
          );
        }

        // TODO: Support milliseconds
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
