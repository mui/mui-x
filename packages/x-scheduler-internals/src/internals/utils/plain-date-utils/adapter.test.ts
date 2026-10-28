import { describe, it, expect } from 'vitest';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import { adapter, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { processDate } from '../../../process-date';
import {
  buildTemporalPlainDate,
  createAdapterDate,
  createAdapterDateFromWallTime,
  createProcessedDate,
  getDateKey,
} from './adapter';
import type { TemporalSupportedObject } from '../../../models';
import type { Adapter } from '../../../use-adapter/useAdapter.types';

describe('base-temporal adapter bridge', () => {
  it('should build the plain date of a value in a timezone', () => {
    // 2025-03-03T00:30Z is March 2nd in Los Angeles.
    const value = adapter.date('2025-03-03T00:30:00Z', 'default');
    const plainDate = buildTemporalPlainDate(adapter, value, 'America/Los_Angeles');
    expect(plainDate.toString()).to.equal('2025-03-02');
  });

  // The instants around DST transitions, the transitions at midnight and the day Apia skipped.
  const INSTANTS = [
    '2026-03-08T04:30:00Z',
    '2026-03-08T05:30:00Z',
    '2026-04-05T03:30:00Z',
    '2026-04-05T15:30:00Z',
    '2026-10-25T00:30:00Z',
    '2026-10-25T01:30:00Z',
    '2011-12-30T09:59:59Z',
    '2011-12-30T10:00:00Z',
  ];

  it('should build the date the adapter reads in the timezone', () => {
    for (const timezone of [
      'UTC',
      'America/New_York',
      'America/Havana',
      'America/St_Johns',
      'America/Santiago',
      'Europe/Paris',
      'Asia/Kolkata',
      'Australia/Lord_Howe',
      'Pacific/Apia',
    ]) {
      for (const instant of INSTANTS) {
        const value = adapter.date(instant, 'default');
        expect(
          buildTemporalPlainDate(adapter, value, timezone).toString(),
          `${instant} in ${timezone}`,
        ).to.equal(adapter.formatByString(adapter.setTimezone(value, timezone), 'yyyy-MM-dd'));
      }
    }
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)(
    'should build the date the adapter reads in the timezone of the system',
    () => {
      setSystemTimezone('Australia/Lord_Howe');
      for (const instant of INSTANTS) {
        const value = adapter.date(instant, 'default');
        expect(buildTemporalPlainDate(adapter, value, 'default').toString(), instant).to.equal(
          adapter.formatByString(value, 'yyyy-MM-dd'),
        );
      }
    },
  );

  it('should return the ISO date of the day in the timezone as the key', () => {
    // July 4th at 02:00 in Tokyo is July 3rd in UTC.
    const value = adapter.date('2025-07-03T17:00:00Z', 'default');
    expect(getDateKey(value, adapter, 'Asia/Tokyo')).to.equal('2025-07-04');
    expect(getDateKey(value, adapter, 'UTC')).to.equal('2025-07-03');
  });

  // The fields of a processed date as the adapter reads them in `timezone`, which processed dates
  // must match.
  const readThroughAdapter = (
    currentAdapter: Adapter,
    value: TemporalSupportedObject,
    timezone: string,
  ) => {
    const valueInTimezone = currentAdapter.setTimezone(value, timezone);
    return {
      key: currentAdapter.formatByString(valueInTimezone, 'yyyy-MM-dd'),
      timestamp: currentAdapter.getTime(value),
      minutesInDay:
        currentAdapter.getHours(valueInTimezone) * 60 + currentAdapter.getMinutes(valueInTimezone),
    };
  };

  it.each(['default', 'UTC', 'America/New_York', 'Asia/Kolkata'])(
    'should process a date in %s like the adapter reads it',
    (timezone) => {
      const epochMs = Date.UTC(2025, 10, 2, 5, 30);
      const value = createAdapterDate(epochMs);
      // A plain `Date`, not a subclass carrying a timezone.
      expect(value.constructor).to.equal(Date);
      expect(adapter.getTime(value)).to.equal(epochMs);

      const { value: processedValue, ...processed } = processDate(value, adapter, timezone);
      expect(processedValue).to.equal(value);
      expect(processed).to.deep.equal(readThroughAdapter(adapter, value, timezone));
      const { value: createdValue, ...created } = createProcessedDate(epochMs, timezone);
      expect(createdValue.constructor).to.equal(Date);
      expect(created).to.deep.equal(readThroughAdapter(adapter, createdValue, timezone));
    },
  );

  it('should process a date with an offset between -01:00 and 00:00', () => {
    // Africa/Monrovia used -00:44:30 until 1972: the epoch is 23:15:30 on December 31st, 1969.
    const { value, ...processed } = createProcessedDate(0, 'Africa/Monrovia');
    expect(processed).to.deep.equal({
      key: '1969-12-31',
      timestamp: 0,
      minutesInDay: 23 * 60 + 15,
    });
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM).each(['America/New_York', 'Australia/Lord_Howe', 'Asia/Kolkata'])(
    'should process a date like the adapter reads it in the system timezone %s',
    (systemTimezone) => {
      setSystemTimezone(systemTimezone);
      // A new adapter, as adapters cache data computed in the current system timezone.
      const systemAdapter = new TemporalAdapterDateFns();
      // 01:30 in New York, on the day it falls back, and 16:30 in Lord Howe.
      const epochMs = Date.UTC(2025, 10, 2, 5, 30);
      const value = systemAdapter.date(new Date(epochMs).toISOString(), 'default');

      const { value: processedValue, ...processed } = processDate(value, systemAdapter, 'default');
      expect(processed).to.deep.equal(readThroughAdapter(systemAdapter, value, 'default'));
      const { value: createdValue, ...created } = createProcessedDate(epochMs, 'default');
      expect(created).to.deep.equal(readThroughAdapter(systemAdapter, createdValue, 'default'));
    },
  );

  describe('createAdapterDateFromWallTime', () => {
    const resolve = (value: string, timezone: string) => {
      const date = createAdapterDateFromWallTime(value, timezone);
      return date === null ? null : new Date(adapter.getTime(date)).toISOString();
    };

    // TZDate resolves DST transitions with the timezone of the system, the plain dates don't.
    describe.each(['UTC', 'America/New_York', 'Europe/Paris'])(
      'system timezone: %s',
      (systemTimezone) => {
        it.skipIf(!isJSDOM && systemTimezone !== 'UTC')(
          'should resolve the wall-clock times of a DST transition like the occurrences',
          () => {
            if (isJSDOM) {
              setSystemTimezone(systemTimezone);
            }
            // Europe/Paris falls back from 03:00 CEST to 02:00 CET on October 26th, 2025: the first 02:30.
            expect(resolve('2025-10-26T02:30:00', 'Europe/Paris')).to.equal(
              '2025-10-26T00:30:00.000Z',
            );
            // Europe/Paris springs forward from 02:00 CET to 03:00 CEST on March 30th, 2025: 03:30.
            expect(resolve('2025-03-30T02:30', 'Europe/Paris')).to.equal(
              '2025-03-30T01:30:00.000Z',
            );
          },
        );
      },
    );

    it('should read dates and times with or without seconds and milliseconds', () => {
      expect(resolve('2025-01-01', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
      expect(resolve('2025-01-01T09:30', 'America/New_York')).to.equal('2025-01-01T14:30:00.000Z');
      expect(resolve('2025-01-01T09:30:15.5', 'UTC')).to.equal('2025-01-01T09:30:15.500Z');
      expect(resolve('2025-01-01T09:30:00', 'Asia/Tokyo')).to.equal('2025-01-01T00:30:00.000Z');
    });

    it('should move the dates and times above their range forward, like Date', () => {
      expect(resolve('2025-02-30T09:00', 'UTC')).to.equal('2025-03-02T09:00:00.000Z');
      expect(resolve('2025-01-01T24:00', 'UTC')).to.equal('2025-01-02T00:00:00.000Z');
    });

    it('should return null for other formats and for unknown timezones', () => {
      expect(resolve('2025-01-01T09:00:00+02:00', 'UTC')).to.equal(null);
      expect(resolve('2025-01-01 09:00', 'UTC')).to.equal(null);
      expect(resolve('20250101', 'UTC')).to.equal(null);
      expect(resolve('2025-01-01T09:00', 'Not/A_Timezone')).to.equal(null);
    });
  });
});
