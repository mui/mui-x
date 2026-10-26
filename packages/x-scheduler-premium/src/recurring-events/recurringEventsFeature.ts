import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../internals/eventDialogOptionalRenderers';
import type { EventTimelinePremiumRecurringEventsFeature } from '../event-timeline-premium/features/EventTimelinePremiumFeatures.types';

/**
 * Adds recurring events support to the Event Timeline.
 * Pass it to the `features` prop of `<EventTimelinePremium />`.
 */
export const recurringEventsFeature: EventTimelinePremiumRecurringEventsFeature = {
  store: schedulerRecurringEventsPlugin,
  optionalRenderers: PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS,
};
