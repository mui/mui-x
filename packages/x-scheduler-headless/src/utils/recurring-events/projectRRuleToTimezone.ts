import { TemporalTimezone } from '../../base-ui-copy/types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { RecurringEventRecurrenceRule } from '../../models';

/**
 * Projects a recurrence rule to a different timezone.
 * This is a derived representation intended for UI purposes only
 */
export function projectRRuleToTimezone(
  adapter: Adapter,
  rrule: RecurringEventRecurrenceRule,
  targetTimezone: TemporalTimezone,
): RecurringEventRecurrenceRule {
  if (!rrule.until) {
    return rrule;
  }

  // TODO: Issue #20600, handle other properties that may be affected by timezone changes
  return {
    ...rrule,
    until: adapter.setTimezone(rrule.until, targetTimezone),
  };
}
