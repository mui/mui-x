import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { getFirstEnabledYear, getLastEnabledYear } from './date';
import { PageGridNavigationTarget, PageListNavigationTarget } from './keyboardNavigation';

export function useMonthsCells(): useMonthsCells.ReturnValue {
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(rootContext.visibleDate),
    [utils, rootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

  const changePage = (direction: 'next' | 'previous') => {
    // TODO: Jump over months with no valid date.
    if (direction === 'previous') {
      const targetDate = utils.addYears(
        utils.startOfYear(rootContext.visibleDate),
        -rootContext.yearPageSize,
      );
      const lastYearInNewPage = utils.addYears(targetDate, rootContext.yearPageSize - 1);

      // All the years before the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isAfter(getFirstEnabledYear(utils, rootContext.validationProps), lastYearInNewPage)
      ) {
        return;
      }

      rootContext.setVisibleDate(
        utils.addYears(rootContext.visibleDate, -rootContext.yearPageSize),
        false,
      );
    }
    if (direction === 'next') {
      const targetDate = utils.addYears(
        utils.startOfYear(rootContext.visibleDate),
        rootContext.yearPageSize,
      );

      // All the years after the visible ones are fully disabled, we skip the navigation.
      if (utils.isBefore(getLastEnabledYear(utils, rootContext.validationProps), targetDate)) {
        return;
      }
      rootContext.setVisibleDate(
        utils.addYears(rootContext.visibleDate, rootContext.yearPageSize),
        false,
      );
    }
  };

  const registerSection = rootContext.registerSection;
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
