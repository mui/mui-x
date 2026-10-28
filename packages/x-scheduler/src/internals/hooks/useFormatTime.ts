import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerOtherSelectors,
  schedulerPreferenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { formatProcessedDateTime } from '../utils/date-utils';

export function useFormatTime() {
  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  return React.useCallback(
    (date: SchedulerProcessedDate) => formatProcessedDateTime(locale, date, ampm),
    [locale, ampm],
  );
}
