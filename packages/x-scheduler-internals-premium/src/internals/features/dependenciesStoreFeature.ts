import { useStore } from '@base-ui/utils/store';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors/eventTimelinePremiumDependencySelectors';
import { EventDependencyDropTarget } from '../../timeline-grid/event/EventDependencyDropTarget';
import { SchedulerSchedulingPlugin } from '../plugins/SchedulerSchedulingPlugin';
import { buildDependenciesState, isDependencyActive } from '../utils/dependency-utils';
import { useDependencyCreationMonitor } from '../utils/useDependencyCreationMonitor';
import type { EventTimelinePremiumDependenciesStoreFeature } from './eventTimelinePremiumStoreFeatures';

function useIsEventDropTarget(occurrenceKey: string, resourceId: SchedulerResourceId) {
  const store = useEventTimelinePremiumStoreContext();
  return useStore(
    store,
    eventTimelinePremiumDependencySelectors.isCreationTarget,
    occurrenceKey,
    resourceId,
  );
}

/**
 * Enables the dependencies between events in the timeline store.
 * @internal
 */
export const dependenciesStoreFeature: EventTimelinePremiumDependenciesStoreFeature = {
  createSchedulingPlugin: (store, onCascade) => new SchedulerSchedulingPlugin(store, onCascade),
  buildState: buildDependenciesState,
  isDependencyActive,
  useCreationMonitor: useDependencyCreationMonitor,
  EventDropTarget: EventDependencyDropTarget,
  useIsEventDropTarget,
};
