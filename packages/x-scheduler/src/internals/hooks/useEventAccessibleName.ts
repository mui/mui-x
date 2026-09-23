import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerPreferenceSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { getPrimaryResourceId } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventLocaleText } from '../../models/translations';
import { getEventAccessibleName } from '../utils/event-accessible-name';

export interface UseEventAccessibleNameParameters {
  /**
   * The occurrence to name, or `null` to skip the computation.
   */
  occurrence: SchedulerRenderableEventOccurrence | null;
  isRecurring: boolean;
  localeText: SchedulerEventLocaleText;
  /**
   * The resource to announce: a name, or `null` to announce none.
   * Defaults to the occurrence's primary resource.
   */
  resourceName?: string | null;
}

/**
 * Accessible name of an event occurrence, or `undefined` without an occurrence.
 */
export function useEventAccessibleName(
  parameters: UseEventAccessibleNameParameters,
): string | undefined {
  const { occurrence, isRecurring, localeText, resourceName: resourceNameProp } = parameters;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);
  const usesPrimaryResource = resourceNameProp === undefined;
  const primaryResource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    usesPrimaryResource ? getPrimaryResourceId(occurrence?.resource) : null,
  );
  const resourceName = usesPrimaryResource ? (primaryResource?.title ?? null) : resourceNameProp;

  return React.useMemo(() => {
    if (occurrence == null) {
      return undefined;
    }

    return getEventAccessibleName({
      occurrence,
      adapter,
      ampm,
      localeText,
      isRecurring,
      resourceName,
    });
  }, [occurrence, adapter, ampm, localeText, isRecurring, resourceName]);
}
