import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { ViewType } from '../../models/views';
import { SchedulerValidDate } from '../../../primitives/models';
import { useEventCallback } from '../../../base-ui-copy/utils/useEventCallback';

const adapter = getAdapter();

type UseDateNavigationProps = {
  visibleDate: SchedulerValidDate;
  setVisibleDate: (date: SchedulerValidDate) => void;
  view: ViewType;
};

function getNavigationDate(view: ViewType, visibleDate: SchedulerValidDate, delta: number) {
  switch (view) {
    case 'day':
      return adapter.addDays(visibleDate, delta);
    case 'month':
      return adapter.addMonths(adapter.startOfMonth(visibleDate), delta);
    case 'agenda':
      return adapter.addDays(visibleDate, 12 * delta);
    case 'week':
    default:
      return adapter.addWeeks(adapter.startOfWeek(visibleDate), delta);
  }
}

export function useDateNavigation({ visibleDate, setVisibleDate, view }: UseDateNavigationProps) {
  const handleNext = useEventCallback(() => {
    const nextDate = getNavigationDate(view, visibleDate, 1);
    setVisibleDate(nextDate);
  });

  const handlePrevious = useEventCallback(() => {
    const prevDate = getNavigationDate(view, visibleDate, -1);
    setVisibleDate(prevDate);
  });

  const handleToday = useEventCallback(() => {
    setVisibleDate(adapter.date());
  });

  return {
    onNextClick: handleNext,
    onPreviousClick: handlePrevious,
    onTodayClick: handleToday,
  };
}
