import { EventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import type { EventTimelinePremiumStoreParameters } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import {
  dependenciesStoreFeature,
  schedulerRecurringEventsPlugin,
} from '@mui/x-scheduler-internals-premium/internals';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';

/**
 * Timeline store that receives the recurring events and dependencies features.
 */
export class EventTimelinePremiumStoreWithFeatures<
  TEvent extends object,
  TResource extends object,
> extends EventTimelinePremiumStore<TEvent, TResource> {
  public constructor(
    parameters: EventTimelinePremiumStoreParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(
      {
        storeFeatures: {
          recurringEvents: schedulerRecurringEventsPlugin,
          dependencies: dependenciesStoreFeature,
        },
        ...parameters,
      },
      adapter,
    );
  }
}

/**
 * Store classes for general scheduler tests.
 * Includes both base and premium stores since they share base behavior.
 */
export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStoreWithFeatures },
];

/**
 * Premium store classes for premium-specific tests (e.g., lazy loading).
 */
export const premiumStoreClasses = [
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStoreWithFeatures },
];
