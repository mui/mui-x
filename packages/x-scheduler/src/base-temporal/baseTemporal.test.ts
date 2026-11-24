import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import { BaseTemporal } from '@mui/x-scheduler/base-temporal';

describe('base-temporal', () => {
  it('should expose the zoned date-times of the occurrences', () => {
    const occurrence = EventBuilder.new()
      .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toOccurrence();

    const { start, end } = occurrence;
    expect(start).to.be.instanceOf(BaseTemporal.ZonedDateTime);
    // Read in the display timezone.
    expect(start.timeZoneId).to.equal('America/New_York');
    expect(start.toPlainDateTime().toString()).to.equal('2025-07-01T05:00:00');
    expect(BaseTemporal.ZonedDateTime.compare(start, end)).to.equal(-1);
    expect(start.toPlainDate().equals(BaseTemporal.PlainDate.from('2025-07-01'))).to.equal(true);
  });

  // The copy of BaseTemporal leaves out the other calendars, which the Scheduler doesn't use (see
  // the notes on the copy in `eslint.config.mjs`).
  it('should only support the ISO calendar', () => {
    const date = BaseTemporal.PlainDate.from('2025-07-01');
    expect(date.withCalendar('ISO8601').calendarId).to.equal('iso8601');
    expect(() => date.withCalendar('gregory')).to.throw('The "gregory" calendar isn\'t supported.');
    expect(() => BaseTemporal.PlainDate.from('2025-07-01[u-ca=gregory]')).to.throw(
      'The "gregory" calendar isn\'t supported.',
    );
    expect(() => BaseTemporal.ZonedDateTime.from('2025-07-01T09:00[UTC][u-ca=hebrew]')).to.throw(
      'The "hebrew" calendar isn\'t supported.',
    );
  });
});
