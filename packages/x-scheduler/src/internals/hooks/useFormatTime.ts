import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerPreferenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { formatHourAndMinutes } from '../utils/date-utils';

export function useFormatTime() {
  // Context hooks
  const adapter = useAdapter();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);

  return React.useCallback(
    (date: TemporalSupportedObject) => {
      return formatHourAndMinutes(date, adapter, ampm);
    },
    [adapter, ampm],
  );
}
