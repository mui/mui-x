import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '../../models';
import { useAdapterContext } from '../../use-adapter-context';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerPreferenceSelectors,
  schedulerResourceSelectors,
} from '../../scheduler-selectors';
import { getPrimaryResourceId } from './event-utils';
import {
  DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
  getEventAccessibleName,
} from './event-accessible-name';
import type { SchedulerEventAccessibleNameLocaleText } from './event-accessible-name';

export interface UseEventAccessibleNameParameters {
  /**
   * The occurrence to name. `null` when the event is not in the store (e.g. a placeholder).
   */
  occurrence: SchedulerRenderableEventOccurrence | null;
  /**
   * Whether to announce the occurrence's primary resource.
   * Leave it off where the surrounding row already carries the resource.
   */
  includeResource: boolean;
  /**
   * The translated sentences. Defaults to English.
   */
  localeText?: SchedulerEventAccessibleNameLocaleText;
}

/**
 * Returns the accessible name of an event occurrence, or `undefined` without an occurrence.
 */
export function useEventAccessibleName(
  parameters: UseEventAccessibleNameParameters,
): string | undefined {
  const {
    occurrence,
    includeResource,
    localeText = DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
  } = parameters;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();

  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence?.id ?? '');
  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    includeResource ? getPrimaryResourceId(occurrence?.resource) : null,
  );
  const resourceName = resource?.title ?? null;

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
