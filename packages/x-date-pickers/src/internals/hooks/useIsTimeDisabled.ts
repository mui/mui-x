import * as React from 'react';
import {
  convertValueToMeridiem,
  createIsAfterIgnoreDatePart,
  type Meridiem,
} from '../utils/time-utils';
import type { MuiPickersAdapter, PickerValidDate, TimeView } from '../../models';
import type { TimeViewWithMeridiem } from '../models';

interface UseIsTimeDisabledParameters {
  adapter: MuiPickersAdapter;
  ampm: boolean;
  valueOrReferenceDate: PickerValidDate;
  disableIgnoringDatePartForTimeValidation: boolean;
  maxTime: PickerValidDate | undefined;
  meridiemMode: Meridiem | null;
  minTime: PickerValidDate | undefined;
  minutesStep: number;
  shouldDisableTime: ((value: PickerValidDate, view: TimeView) => boolean) | undefined;
  disableFuture: boolean | undefined;
  disablePast: boolean | undefined;
  now: PickerValidDate;
  views: readonly TimeViewWithMeridiem[];
}

/**
 * Returns a memoized callback determining whether a given time value is disabled,
 * shared by the `TimeClock` and `MultiSectionDigitalClock` views.
 */
export function useIsTimeDisabled({
  adapter,
  ampm,
  valueOrReferenceDate,
  disableIgnoringDatePartForTimeValidation,
  maxTime,
  meridiemMode,
  minTime,
  minutesStep,
  shouldDisableTime,
  disableFuture,
  disablePast,
  now,
  views,
}: UseIsTimeDisabledParameters) {
  return React.useCallback(
    (rawValue: number, viewType: TimeView) => {
      const isAfter = createIsAfterIgnoreDatePart(
        disableIgnoringDatePartForTimeValidation,
        adapter,
      );
      const shouldCheckPastEnd =
        viewType === 'hours' || (viewType === 'minutes' && views.includes('seconds'));

      const containsValidTime = ({
        start,
        end,
      }: {
        start: PickerValidDate;
        end: PickerValidDate;
      }) => {
        if (minTime && isAfter(minTime, end)) {
          return false;
        }

        if (maxTime && isAfter(start, maxTime)) {
          return false;
        }

        if (disableFuture && isAfter(start, now)) {
          return false;
        }

        if (disablePast && isAfter(now, shouldCheckPastEnd ? end : start)) {
          return false;
        }

        return true;
      };

      const isValidValue = (timeValue: number, step = 1) => {
        if (timeValue % step !== 0) {
          return false;
        }

        if (shouldDisableTime) {
          switch (viewType) {
            case 'hours':
              return !shouldDisableTime(adapter.setHours(valueOrReferenceDate, timeValue), 'hours');
            case 'minutes':
              return !shouldDisableTime(
                adapter.setMinutes(valueOrReferenceDate, timeValue),
                'minutes',
              );
            case 'seconds':
              return !shouldDisableTime(
                adapter.setSeconds(valueOrReferenceDate, timeValue),
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
          const dateWithNewHours = adapter.setHours(valueOrReferenceDate, valueWithMeridiem);

          if (adapter.getHours(dateWithNewHours) !== valueWithMeridiem) {
            return true;
          }

          const start = adapter.setSeconds(adapter.setMinutes(dateWithNewHours, 0), 0);
          const end = adapter.setSeconds(adapter.setMinutes(dateWithNewHours, 59), 59);

          return !containsValidTime({ start, end }) || !isValidValue(valueWithMeridiem);
        }

        case 'minutes': {
          const dateWithNewMinutes = adapter.setMinutes(valueOrReferenceDate, rawValue);
          const start = adapter.setSeconds(dateWithNewMinutes, 0);
          const end = adapter.setSeconds(dateWithNewMinutes, 59);

          return !containsValidTime({ start, end }) || !isValidValue(rawValue, minutesStep);
        }

        case 'seconds': {
          const dateWithNewSeconds = adapter.setSeconds(valueOrReferenceDate, rawValue);
          const start = dateWithNewSeconds;
          const end = dateWithNewSeconds;

          return !containsValidTime({ start, end }) || !isValidValue(rawValue);
        }

        default:
          throw /* minify-error-disabled */ new Error('not supported');
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
      adapter,
      disableFuture,
      disablePast,
      now,
      views,
    ],
  );
}
