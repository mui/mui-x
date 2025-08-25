import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';
import { useAdapter } from '../../utils/adapter/useAdapter';

export function useDayGridCellPlaceholder(
  day: SchedulerValidDate,
): CalendarPrimitiveEventData | null {
  const adapter = useAdapter();
  const { store } = useDayGridRootContext();

  const range = React.useMemo(
    () =>
      [adapter.startOfDay(day), adapter.endOfDay(day)] as [SchedulerValidDate, SchedulerValidDate],
    [adapter, day],
  );

  return useStore(store, selectors.placeholderInRange, range);
}
