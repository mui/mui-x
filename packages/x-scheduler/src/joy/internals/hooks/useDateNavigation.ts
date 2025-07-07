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
      case 'month': {
        const startOfCurrentMonth = adapter.startOfMonth(visibleDate);
        nextDate = adapter.addMonths(startOfCurrentMonth, 1);
        break;
      }
      case 'agenda':
        nextDate = adapter.addDays(visibleDate, 12);
        break;
      case 'week':
      default: {
        const startOfCurrentWeek = adapter.startOfWeek(visibleDate);
        nextDate = adapter.addWeeks(startOfCurrentWeek, 1);
        break;
      }
    }
    setVisibleDate(nextDate);
  }, [visibleDate, setVisibleDate, view]);

  const handlePrevious = React.useCallback(() => {
    let prevDate;
    switch (view) {
      case 'day':
        prevDate = adapter.addDays(visibleDate, -1);
        break;
      case 'month': {
        const startOfCurrentMonth = adapter.startOfMonth(visibleDate);
        prevDate = adapter.addMonths(startOfCurrentMonth, -1);
        break;
      }
      case 'agenda':
        prevDate = adapter.addDays(visibleDate, -12);
        break;
      case 'week':
      default: {
        const startOfCurrentWeek = adapter.startOfWeek(visibleDate);
        prevDate = adapter.addWeeks(startOfCurrentWeek, -1);
        break;
      }
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
