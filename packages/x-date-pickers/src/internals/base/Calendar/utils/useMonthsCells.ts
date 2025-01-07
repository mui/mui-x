import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { getFirstEnabledYear, getLastEnabledYear } from './date';
import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';

export function useMonthsCells(): useMonthsCells.ReturnValue {
  const baseRootContext = useBaseCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(baseRootContext.visibleDate),
    [utils, baseRootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

  const changePage = (direction: 'next' | 'previous') => {
    // TODO: Jump over months with no valid date.
    if (direction === 'previous') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootContext.visibleDate),
        -baseRootContext.yearPageSize,
      );
      const lastYearInNewPage = utils.addYears(targetDate, baseRootContext.yearPageSize - 1);

      // All the years before the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isAfter(
          getFirstEnabledYear(utils, baseRootContext.validationProps),
          lastYearInNewPage,
        )
      ) {
        return;
      }

      baseRootContext.setVisibleDate(
        utils.addYears(baseRootContext.visibleDate, -baseRootContext.yearPageSize),
        false,
      );
    }
    if (direction === 'next') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootContext.visibleDate),
        baseRootContext.yearPageSize,
      );

      // All the years after the visible ones are fully disabled, we skip the navigation.
      if (utils.isBefore(getLastEnabledYear(utils, baseRootContext.validationProps), targetDate)) {
        return;
      }
      baseRootContext.setVisibleDate(
        utils.addYears(baseRootContext.visibleDate, baseRootContext.yearPageSize),
        false,
      );
    }
  };

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: currentYear });
  }, [registerSection, currentYear]);

  return { months, changePage };
}

export namespace useMonthsCells {
  export interface ReturnValue {
    months: PickerValidDate[];
    changePage: (direction: 'next' | 'previous') => void;
  }
}
