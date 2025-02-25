import * as React from 'react';
import { createIsAfterIgnoreDatePart } from '../../../utils/time-utils';
import { PickersTimezone, PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { ClockSection } from './types';
import { ValidateTimeProps } from '../../../../validation';
import { useRegisterSection } from '../../utils/hooks/useRegisterSection';

// TODO: Add prop?
const disableIgnoringDatePartForTimeValidation = false;

export function useIsOptionInvalid(parameters: useIsOptionInvalid.Parameters) {
  const { validationProps, timezone, sectionsRef } = parameters;

  const utils = useUtils();

  return React.useCallback(
    (time: PickerValidDate, section: ClockSection) => {
      const sections = ['unknown', 'hour', 'minute', 'second'].filter(
        (sectionBis) => sectionsRef.current[sectionBis]?.length > 0,
      );
      // TODO: Validation is applied before the sections are registered
      const now = utils.date(undefined, timezone);
      const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
      const shouldCheckPastEnd =
        section === 'hour' || (section === 'minute' && sections.includes('second'));

      const containsValidTime = ({
        start,
        end,
      }: {
        start: PickerValidDate;
        end: PickerValidDate;
      }) => {
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

      switch (section) {
        case 'hour': {
          const start = utils.setSeconds(utils.setMinutes(time, 0), 0);
          const end = utils.setSeconds(utils.setMinutes(time, 59), 59);

          return (
            !containsValidTime({ start, end }) ||
            !!validationProps.shouldDisableTime?.(time, 'hours')
          );
        }

        case 'minute': {
          const start = utils.setSeconds(time, 0);
          const end = utils.setSeconds(time, 59);

          return (
            utils.getMinutes(time) % (validationProps.minutesStep ?? 1) !== 0 ||
            !containsValidTime({ start, end }) ||
            !!validationProps.shouldDisableTime?.(time, 'minutes')
          );
        }

        case 'second': {
          const start = time;
          const end = time;

          return (
            !containsValidTime({ start, end }) ||
            !!validationProps.shouldDisableTime?.(time, 'seconds')
          );
        }

        default:
          throw new Error('not supported');
      }
    },
    [utils, validationProps, timezone, sectionsRef],
  );
}

export namespace useIsOptionInvalid {
  export interface Parameters {
    validationProps: ValidateTimeProps;
    timezone: PickersTimezone;
    sectionsRef: useRegisterSection.SectionsRef<ClockSection>;
  }
}
