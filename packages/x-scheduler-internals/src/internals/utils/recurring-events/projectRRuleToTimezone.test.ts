import { adapter } from 'test/utils/scheduler';
import { SchedulerProcessedEventRecurrenceRule } from '../../../models';
import { projectRRuleToTimezone } from './projectRRuleToTimezone';

describe('recurring-events/projectRRuleToTimezone', () => {
  it('projects UNTIL to the target timezone', () => {
    const rrule: SchedulerProcessedEventRecurrenceRule = {
      freq: 'DAILY',
      until: adapter.date('2025-03-10T23:59:59Z', 'default'),
    };

    const start = adapter.date('2025-03-01T12:00:00', 'America/Los_Angeles');

    const projected = projectRRuleToTimezone(adapter, rrule, 'Europe/Madrid', start);

    expect(projected.until).to.not.equal(rrule.until);
    expect(adapter.getTimezone(projected.until!)).to.equal('Europe/Madrid');
  });

  it('projects multiple WEEKLY BYDAY from data timezone to display timezone (LA → Paris)', () => {
    const rrule: SchedulerProcessedEventRecurrenceRule = {
      freq: 'WEEKLY',
      byDay: ['SU', 'TU'],
    };

    const dtStartLA = adapter.date('2025-03-02T16:00:00', 'America/Los_Angeles');

    const projected = projectRRuleToTimezone(adapter, rrule, 'Europe/Paris', dtStartLA);

    expect(projected.byDay).to.deep.equal(['MO', 'WE']);
  });

  it('does not drift weekdays when crossing midnight (NY → Madrid)', () => {
    const rrule: SchedulerProcessedEventRecurrenceRule = {
      freq: 'WEEKLY',
      byDay: ['MO'],
    };

    const dtStartNY = adapter.date('2025-01-06T23:30:00', 'America/New_York'); // Monday in NY

    const projected = projectRRuleToTimezone(adapter, rrule, 'Europe/Madrid', dtStartNY);

    expect(projected.byDay).to.deep.equal(['TU']);
  });
});
