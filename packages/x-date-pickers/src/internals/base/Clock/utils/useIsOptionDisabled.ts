import * as React from 'react';
import { createIsAfterIgnoreDatePart } from '../../../utils/time-utils';
import { PickerValidDate } from '../../../../models';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useClockRootContext } from '../root/ClockRootContext';

// TODO: Add prop?
const disableIgnoringDatePartForTimeValidation = false;

export function useIsOptionDisabled() {
  const utils = useUtils();
  const now = useNow();
  const rootProps = useClockRootContext();

  return React.useCallback(
    (value: PickerValidDate) => {
      const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
      const shouldCheckPastEnd =
        viewType === 'hours' || (viewType === 'minutes' && views.includes('seconds'));

      const containsValidTime = ({
        start,
        end,
      }: {
        start: PickerValidDate;
        end: PickerValidDate;
      }) => {
        if (
          rootProps.validationProps.minTime != null &&
          isAfter(rootProps.validationProps.minTime, end)
        ) {
          return false;
        }

        if (
          rootProps.validationProps.maxTime != null &&
          isAfter(start, rootProps.validationProps.maxTime)
        ) {
          return false;
        }

        if (rootProps.validationProps.disableFuture && isAfter(start, now)) {
          return false;
        }

        if (
          rootProps.validationProps.disablePast &&
          isAfter(now, shouldCheckPastEnd ? end : start)
        ) {
          return false;
        }

        return true;
      };

      const isValidValue = (timeValue: number, step = 1) => {
        if (timeValue % step !== 0) {
          return false;
        }

        if (rootProps.validationProps.shouldDisableTime) {
          switch (viewType) {
            case 'hours':
              return !rootProps.validationProps.shouldDisableTime(
                utils.setHours(valueOrReferenceDate, timeValue),
                'hours',
              );
            case 'minutes':
              return !rootProps.validationProps.shouldDisableTime(
                utils.setMinutes(valueOrReferenceDate, timeValue),
                'minutes',
              );

            case 'seconds':
              return !rootProps.validationProps.shouldDisableTime(
                utils.setSeconds(valueOrReferenceDate, timeValue),
                'seconds',
              );

            default:
              return false;
          }
        }

        return true;
      };

      switch (viewType) {
        case 'hours': {
          const valueWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, ampm);
          const dateWithNewHours = utils.setHours(valueOrReferenceDate, valueWithMeridiem);

          if (utils.getHours(dateWithNewHours) !== valueWithMeridiem) {
            return true;
          }

          const start = utils.setSeconds(utils.setMinutes(dateWithNewHours, 0), 0);
          const end = utils.setSeconds(utils.setMinutes(dateWithNewHours, 59), 59);

          return !containsValidTime({ start, end }) || !isValidValue(valueWithMeridiem);
        }

        case 'minutes': {
          const dateWithNewMinutes = utils.setMinutes(valueOrReferenceDate, rawValue);
          const start = utils.setSeconds(dateWithNewMinutes, 0);
          const end = utils.setSeconds(dateWithNewMinutes, 59);

          return !containsValidTime({ start, end }) || !isValidValue(rawValue, minutesStep);
        }

        case 'seconds': {
          const dateWithNewSeconds = utils.setSeconds(valueOrReferenceDate, rawValue);
          const start = dateWithNewSeconds;
          const end = dateWithNewSeconds;

          return !containsValidTime({ start, end }) || !isValidValue(rawValue);
        }

        default:
          throw new Error('not supported');
      }
    },
    [
      ampm,
      valueOrReferenceDate,
      disableIgnoringDatePartForTimeValidation,
      maxTime,
      meridiemMode,
      minTime,
      minutesStep,
      shouldDisableTime,
      utils,
      disableFuture,
      disablePast,
      now,
      views,
    ],
  );
}
