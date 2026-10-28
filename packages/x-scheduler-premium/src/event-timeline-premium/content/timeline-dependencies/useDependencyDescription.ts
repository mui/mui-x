'use client';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencySourceDescription } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyType } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';

// TODO(dependencies public flip, #23420): move to localeText, together with the lag sentence
// built below, whose unit names and plural are English too. Hardcoded while the feature has
// no public API.
const DEPENDENCY_SOURCE_DESCRIPTIONS: Record<
  SchedulerDependencyType,
  (title: string, lag: string) => string
> = {
  FinishToStart: (title, lag) => `Cannot start until ${lag}${title} finishes.`,
  StartToStart: (title, lag) => `Cannot start until ${lag}${title} starts.`,
  FinishToFinish: (title, lag) => `Cannot finish until ${lag}${title} finishes.`,
  StartToFinish: (title, lag) => `Cannot finish until ${lag}${title} starts.`,
};

function describeDependencySource(source: SchedulerDependencySourceDescription): string {
  const { lag } = source;
  const lagText =
    lag === null ? '' : `${lag.amount} ${lag.unit}${lag.amount === 1 ? '' : 's'} after `;
  return DEPENDENCY_SOURCE_DESCRIPTIONS[source.type](source.title, lagText);
}

/**
 * Returns the description of the dependencies an occurrence waits on, or `null` when it has none.
 */
export function useDependencyDescription(occurrenceId: SchedulerEventId): string | null {
  const store = useEventTimelinePremiumStoreContext();
  const sources = useStore(
    store,
    eventTimelinePremiumDependencySelectors.activeSourcesForTarget,
    occurrenceId,
  );
  return sources.length > 0 ? sources.map(describeDependencySource).join(' ') : null;
}
