import { warnOnce } from '@mui/x-internals/warning';

/**
 * Tells the "recurring events unavailable" warning which fix to suggest:
 * `'premium'` points to the premium components, `'feature'` points to the `recurringEvents` feature.
 */
export type SchedulerRecurringEventsUnavailableHint = 'premium' | 'feature';

const FEATURE_MESSAGE = [
  'MUI X Scheduler: Some events have an `rrule`, but the recurring events feature is not provided to <EventTimelinePremium />.',
  'Without it, the `rrule` property is ignored and each recurring event renders once, as a single event.',
  'Import `recurringEventsFeature` from `@mui/x-scheduler-premium/recurring-events` and pass it to the component: `<EventTimelinePremium features={{ recurringEvents: recurringEventsFeature }} />`.',
  'See https://mui.com/x/react-scheduler/recurring-events/.',
].join('\n');

export function warnRecurringEventsUnavailable(
  hint: SchedulerRecurringEventsUnavailableHint,
  premiumMessage: string[],
): void {
  if (process.env.NODE_ENV !== 'production') {
    warnOnce(hint === 'feature' ? FEATURE_MESSAGE : premiumMessage.join('\n'));
  }
}
