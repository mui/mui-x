import type * as React from 'react';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumDependenciesStoreFeature } from '@mui/x-scheduler-internals-premium/internals';
import type { SchedulerRecurringEventsFeature } from '../../internals/features/SchedulerRecurringEventsFeature.types';

/**
 * The value of `dependenciesFeature`.
 * Its members are internal and can change: pass `dependenciesFeature` as is.
 */
export interface EventTimelinePremiumDependenciesFeature {
  /**
   * Holds the dependencies, keeps the successors after their predecessors, and creates, edits
   * and deletes the dependencies.
   */
  store: EventTimelinePremiumDependenciesStoreFeature;
  /**
   * Renders the dependency arrows, dialog, interactions and terminals around the rows.
   */
  Layer: React.ComponentType<{ children: React.ReactNode }>;
  /**
   * Returns the description of the dependencies an occurrence waits on, or `null` when it has none.
   */
  useDescription(occurrenceId: SchedulerEventId): string | null;
}

export interface EventTimelinePremiumFeatures {
  /**
   * Recurring events support. Import it from `@mui/x-scheduler-premium/recurring-events`.
   */
  recurringEvents?: SchedulerRecurringEventsFeature;
  /**
   * Dependencies between events. Import it from `@mui/x-scheduler-premium/dependencies`.
   */
  dependencies?: EventTimelinePremiumDependenciesFeature;
}
