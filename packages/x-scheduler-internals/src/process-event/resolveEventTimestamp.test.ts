import { setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { resolveEventTimestamp } from '@mui/x-scheduler-internals/process-event';
import { timestampToEventString, toPlainDateTime } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';

// The instant of an event date string, as an ISO string.
const resolve = (value: string, dataTimezone: string) =>
  new Date(resolveEventTimestamp(value, dataTimezone)).toISOString();

describe('resolveEventTimestamp', () => {
  it('should convert Z-string to an instant', () => {
    expect(resolve('2025-01-01T10:00:00Z', 'America/New_York')).to.equal(
      '2025-01-01T10:00:00.000Z',
    );
  });

  it('should convert non-Z string to wall-time in the given dataTimezone', () => {
    // "2025-01-01T09:00:00" in America/New_York means 09:00 local → 14:00 UTC (EST = UTC-5)
    expect(resolve('2025-01-01T09:00:00', 'America/New_York')).to.equal('2025-01-01T14:00:00.000Z');
  });

  it('should use "default" timezone when dataTimezone is "default"', () => {
    const timestamp = resolveEventTimestamp('2025-01-01T09:00:00', 'default');
    expect(toPlainDateTime(timestamp, 'default').toString()).to.equal('2025-01-01T09:00:00');
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
          expect(resolve('2025-10-26T02:30:00', 'Europe/Paris')).to.equal(
            '2025-10-26T00:30:00.000Z', // The first 02:30, in CEST
          );
          // Europe/Paris springs forward from 02:00 CET to 03:00 CEST on March 30th, 2025.
          expect(resolve('2025-03-30T02:30:00', 'Europe/Paris')).to.equal(
            '2025-03-30T01:30:00.000Z', // 03:30 CEST
          );
        },
      );
    },
  );

  it('should throw when the date is invalid', () => {
    expect(() => resolveEventTimestamp('not-a-date', 'default', 'event-1')).to.throw(
      /MUI X Scheduler: The date "not-a-date" of event "event-1" is not a valid date/,
    );
    expect(() => resolveEventTimestamp('not-a-date', 'America/New_York', 'event-1')).to.throw(
      /MUI X Scheduler: The date "not-a-date" of event "event-1" is not a valid date/,
    );
  });

  it('should throw when the timezone is unknown', () => {
    expect(() =>
      resolveEventTimestamp('2025-01-01T09:00:00', 'Not/A_Timezone', 'event-1'),
    ).to.throw(
      /MUI X Scheduler: The date "2025-01-01T09:00:00" of event "event-1" is not a valid date/,
    );
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)('should read a date in another format at midnight in dataTimezone', () => {
    setSystemTimezone('America/New_York');
    // `Date.parse()` reads `2025/01/01` in the timezone of the system, not as UTC.
    expect(resolve('2025/01/01', 'default')).to.equal('2025-01-01T05:00:00.000Z');
    expect(resolve('2025/01/01', 'Europe/Paris')).to.equal('2024-12-31T23:00:00.000Z');
    expect(resolve('2025-01-01', 'default')).to.equal('2025-01-01T05:00:00.000Z');
    expect(resolve('2025-01', 'default')).to.equal('2025-01-01T05:00:00.000Z');
    expect(resolve('2025', 'default')).to.equal('2025-01-01T05:00:00.000Z');
  });

  it('should read the time of a date in another format in dataTimezone', () => {
    expect(resolve('2025/01/01 09:00', 'America/New_York')).to.equal('2025-01-01T14:00:00.000Z');
  });

  it('should read a year or a month at midnight in dataTimezone', () => {
    expect(resolve('2025-01', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
    expect(resolve('2025', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
  });

  it('should read a date-time with an offset as an instant', () => {
    expect(resolve('2025-01-01T09:00:00+02:00', 'America/New_York')).to.equal(
      '2025-01-01T07:00:00.000Z',
    );
  });

  // The strings written back by `timestampToEventString()` keep the instant they were read as.
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
      const timestamp = resolveEventTimestamp(value, dataTimezone);
      const written = timestampToEventString(timestamp, value, dataTimezone);
      expect(written.endsWith('Z')).to.equal(isInstant);
      expect(resolveEventTimestamp(written, dataTimezone)).to.equal(timestamp);
    });
  });
});
