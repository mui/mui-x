import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';

export function useDayGridPlaceholderInDay(
  day: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const { store } = useDayGridRootContext();

  return useStore(store, selectors.placeholderInDay, day);
}
