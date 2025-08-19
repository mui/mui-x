import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { selectors } from '../root/store';

export function useTimeGridPlaceholderInRange(
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const { store } = useTimeGridRootContext();

  return useStore(store, selectors.placeholderInRange, start, end);
}
