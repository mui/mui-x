'use client';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../internals/eventDialogOptionalRenderers';
import type { SchedulerRecurringEventsFeature } from '../internals/features/SchedulerRecurringEventsFeature.types';

/**
 * Adds recurring events support to the Event Calendar and the Event Timeline.
 * Pass it to the `features` prop of `<EventCalendarPremium />`, of its standalone views,
 * or of `<EventTimelinePremium />`.
 */
export const recurringEventsFeature: SchedulerRecurringEventsFeature = {
  store: schedulerRecurringEventsPlugin,
  optionalRenderers: PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS,
};
