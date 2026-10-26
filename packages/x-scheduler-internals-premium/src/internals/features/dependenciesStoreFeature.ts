import { useStore } from '@base-ui/utils/store';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors/eventTimelinePremiumDependencySelectors';
import { useEventDependencyDropTarget } from '../../timeline-grid/event/useEventDependencyDropTarget';
import { SchedulerSchedulingPlugin } from '../plugins/SchedulerSchedulingPlugin';
import { buildDependenciesState, isDependencyActive } from '../utils/dependency-utils';
import { useDependencyCreationMonitor } from '../utils/useDependencyCreationMonitor';
import type {
  EventTimelinePremiumDependenciesStoreFeature,
  UseEventDependencyDropTargetParameters,
} from './eventTimelinePremiumStoreFeatures';

function useEventDropTarget(parameters: UseEventDependencyDropTargetParameters) {
  useEventDependencyDropTarget(parameters);
  const store = useEventTimelinePremiumStoreContext();
  return useStore(
    store,
    eventTimelinePremiumDependencySelectors.isCreationTarget,
    parameters.occurrenceKey,
    parameters.resourceId,
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
  useEventDropTarget,
};
