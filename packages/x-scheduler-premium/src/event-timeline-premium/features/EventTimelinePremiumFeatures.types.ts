import type * as React from 'react';
import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumDependenciesStoreFeature } from '@mui/x-scheduler-internals-premium/internals';
import type { EventEditingOptionalRenderers } from '@mui/x-scheduler/internals';

export interface EventTimelinePremiumRecurringEventsFeature {
  /**
   * Expands the events with an `rrule` into occurrences.
   */
  store: SchedulerRecurringEventsPluginInterface;
  /**
   * The recurrence tab and the scope dialog of the event editing surfaces.
   */
  optionalRenderers: EventEditingOptionalRenderers;
}

/**
 * @internal
 */
export interface EventTimelinePremiumDependenciesFeature {
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
  recurringEvents?: EventTimelinePremiumRecurringEventsFeature;
}

/**
 * @internal
 */
export interface EventTimelinePremiumInternalFeatures extends EventTimelinePremiumFeatures {
  dependencies?: EventTimelinePremiumDependenciesFeature;
}
