import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { selectors } from '../root/store';

export function useTimeGridPlaceholderInRange(
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const { store } = useTimeGridRootContext();

  const range = React.useMemo(
    () => [start, end] as [SchedulerValidDate, SchedulerValidDate],
    [start, end],
  );

  return useStore(store, selectors.placeholderInRange, range);
}
