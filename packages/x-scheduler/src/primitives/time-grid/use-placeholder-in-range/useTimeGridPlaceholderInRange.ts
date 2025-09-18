import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';

export function useTimeGridPlaceholderInRange(
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const store = useEventCalendarStoreContext();
  const { id: gridId } = useTimeGridRootContext();

  return useStore(store, selectors.draggedOccurrenceToRenderInTimeRange, start, end, gridId);
}
