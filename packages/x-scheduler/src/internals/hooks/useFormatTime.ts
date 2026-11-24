import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerOtherSelectors,
  schedulerPreferenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { formatTime, getMinutesInDay } from '@mui/x-scheduler-internals/internals';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';

export function useFormatTime() {
  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  return React.useCallback(
    (date: BaseTemporal.ZonedDateTime) => formatTime(locale, getMinutesInDay(date), ampm),
    [locale, ampm],
  );
}
