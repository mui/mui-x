import { EventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type { EventCalendarPremiumStoreParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import type { EventTimelinePremiumStoreParameters } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import {
  dependenciesStoreFeature,
  schedulerRecurringEventsPlugin,
} from '@mui/x-scheduler-internals-premium/internals';

/**
 * Calendar store that receives the recurring events feature.
 */
export class EventCalendarPremiumStoreWithFeatures<
  TEvent extends object,
  TResource extends object,
> extends EventCalendarPremiumStore<TEvent, TResource> {
  public constructor(parameters: EventCalendarPremiumStoreParameters<TEvent, TResource>) {
    super({ storeFeatures: { recurringEvents: schedulerRecurringEventsPlugin }, ...parameters });
  }
}

/**
 * Timeline store that receives the recurring events and dependencies features.
 */
export class EventTimelinePremiumStoreWithFeatures<
  TEvent extends object,
  TResource extends object,
> extends EventTimelinePremiumStore<TEvent, TResource> {
  public constructor(parameters: EventTimelinePremiumStoreParameters<TEvent, TResource>) {
    super({
      storeFeatures: {
        recurringEvents: schedulerRecurringEventsPlugin,
        dependencies: dependenciesStoreFeature,
      },
      ...parameters,
    });
  }
}

/**
 * Store classes for general scheduler tests.
 * Includes both base and premium stores since they share base behavior.
 */
export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStoreWithFeatures },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStoreWithFeatures },
];

/**
 * Premium store classes for premium-specific tests (e.g., lazy loading).
 */
export const premiumStoreClasses = [
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStoreWithFeatures },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStoreWithFeatures },
];
