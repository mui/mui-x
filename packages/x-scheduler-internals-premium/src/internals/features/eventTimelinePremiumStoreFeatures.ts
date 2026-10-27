import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventUpdatedProperties } from '@mui/x-scheduler-internals/models';
import type { SchedulerDependenciesState, SchedulerDependency } from '../../models';
import type { SchedulerSchedulingPlugin } from '../plugins/SchedulerSchedulingPlugin';
import type { isDependencyActive } from '../utils/dependency-utils';
import type { useEventDependencyDropTarget } from '../../timeline-grid/event/useEventDependencyDropTarget';
import type { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';
import type {
  EventTimelinePremiumState,
  EventTimelinePremiumStoreParameters,
} from '../../use-event-timeline-premium/EventTimelinePremiumStore.types';

export type UseEventDependencyDropTargetParameters = useEventDependencyDropTarget.Parameters;

/**
 * The dependencies engine of the timeline store, and the hooks of its UI.
 * @internal
 */
export interface EventTimelinePremiumDependenciesStoreFeature {
  createSchedulingPlugin(
    store: EventTimelinePremiumStore<any, any>,
    onCascade: (updated: SchedulerEventUpdatedProperties[]) => void,
  ): SchedulerSchedulingPlugin<
    any,
    EventTimelinePremiumState,
    EventTimelinePremiumStoreParameters<any, any>
  >;
  buildState(dependencies: readonly SchedulerDependency[] | undefined): SchedulerDependenciesState;
  isDependencyActive: typeof isDependencyActive;
  /**
   * Finalizes the create-dependency gesture. Called by `TimelineGrid.Root`.
   */
  useCreationMonitor(): void;
  /**
   * Registers an event element as a drop target of the create-dependency gesture.
   * Returns whether the gesture currently targets it.
   */
  useEventDropTarget(parameters: UseEventDependencyDropTargetParameters): boolean;
}

/**
 * Optional features the timeline store receives at construction.
 * They are read once, later values are ignored.
 * They also carry the hooks of the `TimelineGrid` parts, which can only reach the store.
 * @internal
 */
export interface EventTimelinePremiumStoreFeatures {
  /**
   * Expands the events with an `rrule` into occurrences.
   * Without it, the events render once.
   */
  recurringEvents?: SchedulerRecurringEventsPluginInterface;
  /**
   * Enables the dependencies between events.
   * Without it, the `dependencies` parameter is ignored.
   */
  dependencies?: EventTimelinePremiumDependenciesStoreFeature;
}

export const EMPTY_DEPENDENCIES_STATE: SchedulerDependenciesState = {
  dependencyModelList: EMPTY_ARRAY,
  dependencyModelLookup: new Map(),
};

export const NOOP_USE_CREATION_MONITOR = () => {};

export const NOOP_USE_EVENT_DROP_TARGET: (
  parameters: UseEventDependencyDropTargetParameters,
) => boolean = () => false;

export const selectDependenciesFeature = (state: EventTimelinePremiumState) =>
  state.dependenciesFeature;
