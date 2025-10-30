import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { selectors } from '@mui/x-scheduler-headless/scheduler-selectors';

export function useFormatTime() {
  // Context hooks
  const adapter = useAdapter();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const ampm = useStore(store, selectors.ampm);

  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';
  return React.useCallback(
    (date: SchedulerValidDate) => {
      return adapter.format(date, timeFormat);
    },
    [adapter, timeFormat],
  );
}
