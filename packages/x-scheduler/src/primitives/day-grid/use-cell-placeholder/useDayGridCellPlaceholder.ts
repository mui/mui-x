import * as React from 'react';
import { useSelector } from '../../../base-ui-copy/utils/store';
import { EventData, SchedulerValidDate } from '../../models';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';
import { useAdapter } from '../../utils/adapter/useAdapter';

export function useDayGridCellPlaceholder(day: SchedulerValidDate): EventData | null {
  const adapter = useAdapter();
  const { store } = useDayGridRootContext();

  const range = React.useMemo(
    () =>
      [adapter.startOfDay(day), adapter.endOfDay(day)] as [SchedulerValidDate, SchedulerValidDate],
    [adapter, day],
  );

  return useSelector(store, selectors.placeholderInRange, range);
}
