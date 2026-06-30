import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerPreferenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { formatHourAndMinutes } from '../utils/date-utils';

export function useFormatTime() {
  // Context hooks
  const adapter = useAdapterContext();
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
