import type * as React from 'react';
import type { SchedulerRecurringEventsFeature } from '../../internals/features/SchedulerRecurringEventsFeature.types';

export interface EventCalendarPremiumFeatures {
  /**
   * Recurring events support. Import it from `@mui/x-scheduler-premium/recurring-events`.
   */
  recurringEvents?: SchedulerRecurringEventsFeature;
  /**
   * Charts panel. Import it from `@mui/x-scheduler-premium/charts`.
   */
  charts?: EventCalendarPremiumChartsFeature;
}

export interface EventCalendarPremiumChartsFeature {
  /**
   * Renders the insights cards in the side panel.
   */
  Panel: React.ComponentType;
}
