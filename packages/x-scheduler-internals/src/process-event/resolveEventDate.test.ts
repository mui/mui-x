import { adapter } from 'test/utils/scheduler/adapters';
import { setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
import { describe, it, expect } from 'vitest';

describe('resolveEventDate', () => {
  it('should convert Z-string to an instant', () => {
    const result = resolveEventDate('2025-01-01T10:00:00Z', 'America/New_York', adapter);
    expect(result).to.be.instanceOf(Date);
    expect(result.getTime()).to.equal(new Date('2025-01-01T10:00:00Z').getTime());
  });

  it('should convert non-Z string to wall-time in the given dataTimezone', () => {
    // "2025-01-01T09:00:00" in America/New_York means 09:00 local → 14:00 UTC (EST = UTC-5)
    const result = resolveEventDate('2025-01-01T09:00:00', 'America/New_York', adapter);
    expect(result).to.be.instanceOf(Date);
    expect(result.getTime()).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
  });

  it('should use "default" timezone when dataTimezone is "default"', () => {
    const result = resolveEventDate('2025-01-01T09:00:00', 'default', adapter);
    expect(adapter.getHours(result)).to.equal(9);
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
          const repeated = resolveEventDate('2025-10-26T02:30:00', 'Europe/Paris', adapter);
          expect(new Date(adapter.getTime(repeated)).toISOString()).to.equal(
            '2025-10-26T00:30:00.000Z', // The first 02:30, in CEST
          );
          // Europe/Paris springs forward from 02:00 CET to 03:00 CEST on March 30th, 2025.
          const skipped = resolveEventDate('2025-03-30T02:30:00', 'Europe/Paris', adapter);
          expect(new Date(adapter.getTime(skipped)).toISOString()).to.equal(
            '2025-03-30T01:30:00.000Z', // 03:30 CEST
          );
        },
      );
    },
  );

  it('should throw when the date is invalid', () => {
    expect(() => resolveEventDate('not-a-date', 'default', adapter, 'event-1')).to.throw(
      /MUI X Scheduler: The date "not-a-date" of event "event-1" is not a valid date/,
    );
  });
});
