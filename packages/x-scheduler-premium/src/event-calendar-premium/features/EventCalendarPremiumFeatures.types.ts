import type * as React from 'react';
import type { SchedulerRecurringEventsFeature } from '../../internals/features/SchedulerRecurringEventsFeature.types';

export interface StandaloneViewPremiumFeatures {
  /**
   * Recurring events support. Import it from `@mui/x-scheduler-premium/recurring-events`.
   */
  recurringEvents?: SchedulerRecurringEventsFeature;
}

export interface EventCalendarPremiumFeatures extends StandaloneViewPremiumFeatures {
  /**
   * Charts in the side panel. Create it with `createChartsFeature` from `@mui/x-scheduler-premium/charts`.
   */
  charts?: EventCalendarPremiumChartsFeature;
}

/**
 * The charts feature, created with `createChartsFeature` from `@mui/x-scheduler-premium/charts`.
 * Its members are internal and can change: pass the created feature as is.
 */
export interface EventCalendarPremiumChartsFeature {
  /**
   * Renders the cards in the side panel.
   */
  Panel: React.ComponentType;
}
