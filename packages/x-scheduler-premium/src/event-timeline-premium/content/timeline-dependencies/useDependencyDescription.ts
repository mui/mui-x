'use client';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencySourceDescription } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import type { EventTimelineLocaleText } from '@mui/x-scheduler/models';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

function describeDependencySource(
  localeText: EventTimelineLocaleText,
  source: SchedulerDependencySourceDescription,
): string {
  const params = {
    title: source.title,
    lag: source.lag === null ? null : localeText.dependencyLag(source.lag.amount, source.lag.unit),
  };
  switch (source.type) {
    case 'FinishToStart':
      return localeText.dependencyFinishToStartDescription(params);
    case 'StartToStart':
      return localeText.dependencyStartToStartDescription(params);
    case 'FinishToFinish':
      return localeText.dependencyFinishToFinishDescription(params);
    default:
      return localeText.dependencyStartToFinishDescription(params);
  }
}

/**
 * Returns the description of the dependencies an occurrence waits on, or `null` when it has none.
 */
export function useDependencyDescription(occurrenceId: SchedulerEventId): string | null {
  const store = useEventTimelinePremiumStoreContext();
  const { localeText } = useEventTimelinePremiumStyledContext();
  const sources = useStore(
    store,
    eventTimelinePremiumDependencySelectors.activeSourcesForTarget,
    occurrenceId,
  );
  return sources.length > 0
    ? sources.map((source) => describeDependencySource(localeText, source)).join(' ')
    : null;
}
