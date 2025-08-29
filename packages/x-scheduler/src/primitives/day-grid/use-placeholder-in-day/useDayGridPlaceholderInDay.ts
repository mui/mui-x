import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';
import { useDayGridRowContext } from '../row/DayGridRowContext';

export function useDayGridPlaceholderInDay(
  day: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const { store } = useDayGridRootContext();
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();

  return useStore(store, selectors.placeholderInDay, day, rowStart, rowEnd);
}
