import * as React from 'react';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { ViewType } from '../../models/views';
import { SchedulerValidDate } from '../../../primitives/models';

const adapter = getAdapter();

type UseDateNavigationProps = {
  visibleDate: SchedulerValidDate;
  setVisibleDate: (date: SchedulerValidDate) => void;
  view: ViewType;
};

export function useDateNavigation({ visibleDate, setVisibleDate, view }: UseDateNavigationProps) {
  const handleNext = React.useCallback(() => {
    let nextDate;
    switch (view) {
      case 'day':
        nextDate = adapter.addDays(visibleDate, 1);
        break;
      case 'month':
        nextDate = adapter.addMonths(visibleDate, 1);
        break;
      case 'agenda':
        nextDate = adapter.addDays(visibleDate, 14);
        break;
      case 'week':
      default:
        nextDate = adapter.addWeeks(visibleDate, 1);
        break;
    }
    setVisibleDate(nextDate);
  }, [visibleDate, setVisibleDate, view]);

  const handlePrevious = React.useCallback(() => {
    let prevDate;
    switch (view) {
      case 'day':
        prevDate = adapter.addDays(visibleDate, -1);
        break;
      case 'month':
        prevDate = adapter.addMonths(visibleDate, -1);
        break;
      case 'agenda':
        prevDate = adapter.addDays(visibleDate, -14);
        break;
      case 'week':
      default:
        prevDate = adapter.addWeeks(visibleDate, -1);
        break;
    }
    setVisibleDate(prevDate);
  }, [visibleDate, setVisibleDate, view]);

  const handleToday = React.useCallback(() => {
    setVisibleDate(adapter.date());
  }, [setVisibleDate]);

  return {
    onNextClick: handleNext,
    onPreviousClick: handlePrevious,
    onTodayClick: handleToday,
  };
}
