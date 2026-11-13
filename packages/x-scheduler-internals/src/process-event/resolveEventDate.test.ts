import { setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
import { dateToEventString } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';

describe('resolveEventDate', () => {
  it('should convert Z-string to an instant', () => {
    const result = resolveEventDate('2025-01-01T10:00:00Z', 'America/New_York');
    // A plain `Date`, not a subclass carrying a timezone.
    expect(result.constructor).to.equal(Date);
    expect(result.getTime()).to.equal(new Date('2025-01-01T10:00:00Z').getTime());
  });

  it('should convert non-Z string to wall-time in the given dataTimezone', () => {
    // "2025-01-01T09:00:00" in America/New_York means 09:00 local → 14:00 UTC (EST = UTC-5)
    const result = resolveEventDate('2025-01-01T09:00:00', 'America/New_York');
    expect(result.constructor).to.equal(Date);
    expect(result.getTime()).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
  });

  it('should use "default" timezone when dataTimezone is "default"', () => {
    const result = resolveEventDate('2025-01-01T09:00:00', 'default');
    expect(result.getHours()).to.equal(9);
  });

  // The DST transitions must resolve the same way whatever the timezone of the system.
  describe.each(['UTC', 'America/New_York', 'Europe/Paris'])(
    'system timezone: %s',
    (systemTimezone) => {
      it.skipIf(!isJSDOM && systemTimezone !== 'UTC')(
        'should resolve a wall-time repeated or skipped by a DST transition like RFC 5545',
        () => {
          if (isJSDOM) {
            setSystemTimezone(systemTimezone);
          }
          // Europe/Paris falls back from 03:00 CEST to 02:00 CET on October 26th, 2025.
          const repeated = resolveEventDate('2025-10-26T02:30:00', 'Europe/Paris');
          expect(repeated.toISOString()).to.equal(
            '2025-10-26T00:30:00.000Z', // The first 02:30, in CEST
          );
          // Europe/Paris springs forward from 02:00 CET to 03:00 CEST on March 30th, 2025.
          const skipped = resolveEventDate('2025-03-30T02:30:00', 'Europe/Paris');
          expect(skipped.toISOString()).to.equal(
            '2025-03-30T01:30:00.000Z', // 03:30 CEST
          );
        },
      );
    },
  );

  it('should throw when the date is invalid', () => {
    expect(() => resolveEventDate('not-a-date', 'default', 'event-1')).to.throw(
      /MUI X Scheduler: The date "not-a-date" of event "event-1" is not a valid date/,
    );
    expect(() => resolveEventDate('not-a-date', 'America/New_York', 'event-1')).to.throw(
      /MUI X Scheduler: The date "not-a-date" of event "event-1" is not a valid date/,
    );
  });

  it('should throw when the timezone is unknown', () => {
    expect(() => resolveEventDate('2025-01-01T09:00:00', 'Not/A_Timezone', 'event-1')).to.throw(
      /MUI X Scheduler: The date "2025-01-01T09:00:00" of event "event-1" is not a valid date/,
    );
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)('should read a date in another format at midnight in dataTimezone', () => {
    setSystemTimezone('America/New_York');
    // `Date.parse()` reads `2025/01/01` in the timezone of the system, not as UTC.
    expect(resolveEventDate('2025/01/01', 'default').toISOString()).to.equal(
      '2025-01-01T05:00:00.000Z',
    );
    expect(resolveEventDate('2025/01/01', 'Europe/Paris').toISOString()).to.equal(
      '2024-12-31T23:00:00.000Z',
    );
    expect(resolveEventDate('2025-01-01', 'default').toISOString()).to.equal(
      '2025-01-01T05:00:00.000Z',
    );
    expect(resolveEventDate('2025-01', 'default').toISOString()).to.equal(
      '2025-01-01T05:00:00.000Z',
    );
    expect(resolveEventDate('2025', 'default').toISOString()).to.equal('2025-01-01T05:00:00.000Z');
  });

  it('should read the time of a date in another format in dataTimezone', () => {
    expect(resolveEventDate('2025/01/01 09:00', 'America/New_York').toISOString()).to.equal(
      '2025-01-01T14:00:00.000Z',
    );
  });

  it('should read a year or a month at midnight in dataTimezone', () => {
    expect(resolveEventDate('2025-01', 'America/New_York').toISOString()).to.equal(
      '2025-01-01T05:00:00.000Z',
    );
    expect(resolveEventDate('2025', 'America/New_York').toISOString()).to.equal(
      '2025-01-01T05:00:00.000Z',
    );
  });

  it('should read a date-time with an offset as an instant', () => {
    const result = resolveEventDate('2025-01-01T09:00:00+02:00', 'America/New_York');
    expect(result.toISOString()).to.equal('2025-01-01T07:00:00.000Z');
  });

  // The strings written back by `dateToEventString()` keep the instant they were read as.
  describe.each(['Europe/Paris', 'default'])('round trip in %s', (dataTimezone) => {
    it.each([
      { value: '2025-01-01T09:00:00Z', isInstant: true },
      { value: '2025-01-01T09:00:00-03:30', isInstant: true },
      { value: '2025-01-01T09:00:00.000+01:00', isInstant: true },
      { value: '2025-01-01T09:00:00', isInstant: false },
      { value: '2025-01-01', isInstant: false },
      { value: '2025-01', isInstant: false },
      { value: '2025/01/01 09:00', isInstant: false },
      // Repeated by the DST transition of Europe/Paris.
      { value: '2025-10-26T02:30:00', isInstant: false },
    ])('should keep the instant of $value', ({ value, isInstant }) => {
      const date = resolveEventDate(value, dataTimezone);
      const written = dateToEventString(date, value, dataTimezone);
      expect(written.endsWith('Z')).to.equal(isInstant);
      expect(resolveEventDate(written, dataTimezone).getTime()).to.equal(date.getTime());
    });
  });
});
