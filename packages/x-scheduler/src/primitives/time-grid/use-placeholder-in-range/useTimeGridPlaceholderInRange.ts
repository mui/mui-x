import * as React from 'react';
import { useSelector } from '../../../base-ui-copy/utils/store';
import { EventData, SchedulerValidDate } from '../../models';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { selectors } from '../root/store';

export function useTimeGridPlaceholderInRange(
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): EventData | null {
  const { store } = useTimeGridRootContext();

  const range = React.useMemo(
    () => [start, end] as [SchedulerValidDate, SchedulerValidDate],
    [start, end],
  );

  return useSelector(store, selectors.placeholderInRange, range);
}
