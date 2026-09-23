import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence, SchedulerResourceId } from '../../models';
import { useAdapterContext } from '../../use-adapter-context';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerPreferenceSelectors,
  schedulerResourceSelectors,
} from '../../scheduler-selectors';
import { generateOccurrenceFromEvent, getPrimaryResourceId } from './event-utils';
import type { useOriginalOccurrence } from './useOriginalOccurrence';
import {
  DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
  getEventAccessibleName,
} from './event-accessible-name';
import type { SchedulerEventAccessibleNameLocaleText } from './event-accessible-name';

export interface UseEventAccessibleNameParameters {
  /**
   * The occurrence to name, or `null` to skip the computation.
   */
  occurrence: SchedulerRenderableEventOccurrence | null;
  isRecurring: boolean;
  /**
   * Name of the resource to announce, if any.
   */
  resourceName?: string | null;
  /**
   * The translated sentences. Defaults to English.
   */
  localeText?: SchedulerEventAccessibleNameLocaleText;
}

/**
 * Accessible name of an event occurrence, or `undefined` without an occurrence.
 */
export function useEventAccessibleName(
  parameters: UseEventAccessibleNameParameters,
): string | undefined {
  const {
    occurrence,
    isRecurring,
    resourceName = null,
    localeText = DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
  } = parameters;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const ampm = useStore(store, schedulerPreferenceSelectors.ampm);

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

export interface UseDefaultEventAccessibleNameParameters extends useOriginalOccurrence.Parameters {
  /**
   * The resource to announce. Defaults to the event's primary resource.
   */
  resourceId?: SchedulerResourceId | null;
  /**
   * `false` returns `undefined` without resolving the name, e.g. when the consumer passed its own label.
   */
  enabled: boolean;
}

/**
 * English default name of a headless event primitive, resolved from the store.
 * `undefined` when disabled or when the event is not in the store.
 */
export function useDefaultEventAccessibleName(
  parameters: UseDefaultEventAccessibleNameParameters,
): string | undefined {
  const { eventId, occurrenceKey, start, end, dataTimezone, resourceId, enabled } = parameters;
  const store = useSchedulerStoreContext();

  const lookupId = enabled ? eventId : null;
  const event = useStore(store, schedulerEventSelectors.processedEvent, lookupId);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, lookupId);
  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    resourceId ?? getPrimaryResourceId(event?.resource),
  );

  const occurrence = React.useMemo(
    () =>
      event
        ? generateOccurrenceFromEvent({ event, eventId, occurrenceKey, start, end, dataTimezone })
        : null,
    [event, eventId, occurrenceKey, start, end, dataTimezone],
  );

  return useEventAccessibleName({ occurrence, isRecurring, resourceName: resource?.title });
}
