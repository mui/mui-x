import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import type * as React from 'react';
import type {
  SchedulerEventUpdatedProperties,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import type { SchedulerDependenciesState, SchedulerDependency } from '../../models';
import type { SchedulerSchedulingPlugin } from '../plugins/SchedulerSchedulingPlugin';
import type { isDependencyActive } from '../utils/dependency-utils';
import type { EventDependencyDropTarget } from '../../timeline-grid/event/EventDependencyDropTarget';
import type { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';
import type {
  EventTimelinePremiumState,
  EventTimelinePremiumStoreParameters,
} from '../../use-event-timeline-premium/EventTimelinePremiumStore.types';

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
   * Registers the event element it renders as a drop target of the create-dependency gesture.
   */
  EventDropTarget: React.ComponentType<EventDependencyDropTarget.Props>;
  /**
   * Returns whether the create-dependency gesture currently targets the event.
   */
  useIsEventDropTarget(occurrenceKey: string, resourceId: SchedulerResourceId): boolean;
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
