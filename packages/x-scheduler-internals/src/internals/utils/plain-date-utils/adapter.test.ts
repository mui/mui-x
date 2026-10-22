import { describe, it, expect } from 'vitest';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import { adapter, adapterFr, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { processDate } from '../../../process-date';
import { getDateKey } from '../date-utils';
import {
  buildTemporalPlainDate,
  createAdapterDate,
  createAdapterDateFromWallTime,
  createProcessedDate,
  getPlainDateKey,
} from './adapter';
import { PlainDate } from '../base-temporal/PlainDate';

describe('base-temporal adapter bridge', () => {
  it('should build the plain date of a value in the timezone it is labeled with', () => {
    // 2025-03-03T00:30Z is March 2nd in Los Angeles.
    const value = adapter.setTimezone(
      adapter.date('2025-03-03T00:30:00Z', 'default'),
      'America/Los_Angeles',
    );
    const plainDate = buildTemporalPlainDate(adapter, value);
    expect(plainDate.toString()).to.equal('2025-03-02');
  });

  it('should return the key getDateKey() returns for the same day', () => {
    for (const currentAdapter of [adapter, adapterFr]) {
      const value = currentAdapter.date('2025-07-04T15:00:00', 'Asia/Tokyo');
      const plainDate = buildTemporalPlainDate(currentAdapter, value);
      expect(getPlainDateKey(currentAdapter, plainDate)).to.equal(
        getDateKey(value, currentAdapter),
      );
    }
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)('should return the key of a day the system timezone skips', () => {
    // Pacific/Apia skipped December 30th, 2011.
    setSystemTimezone('Pacific/Apia');
    const systemAdapter = new TemporalAdapterDateFns();
    expect(
      getPlainDateKey(systemAdapter, PlainDate.from({ year: 2011, month: 12, day: 30 })),
    ).to.equal('12/30/2011');
  });

  it('should create the processed date processDate() returns for the same instant', () => {
    const epochMs = Date.UTC(2025, 10, 2, 5, 30);
    for (const timezone of ['default', 'UTC', 'America/New_York', 'Asia/Kolkata']) {
      const value = createAdapterDate(adapter, epochMs, timezone);
      expect(adapter.getTime(value)).to.equal(epochMs);
      expect(adapter.getTimezone(value)).to.equal(timezone === 'default' ? 'system' : timezone);

      const { value: createdValue, ...created } = createProcessedDate(adapter, epochMs, timezone);
      const { value: processedValue, ...processed } = processDate(value, adapter);
      expect(created).to.deep.equal(processed);
      expect(adapter.getTime(createdValue)).to.equal(adapter.getTime(processedValue));
    }
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM).each(['America/New_York', 'Australia/Lord_Howe', 'Asia/Kolkata'])(
    'should create the processed date processDate() returns in the system timezone %s',
    (systemTimezone) => {
      setSystemTimezone(systemTimezone);
      // A new adapter, as adapters cache data computed in the current system timezone.
      const systemAdapter = new TemporalAdapterDateFns();
      // 01:30 in New York, on the day it falls back, and 16:30 in Lord Howe.
      const epochMs = Date.UTC(2025, 10, 2, 5, 30);
      const { value, ...created } = createProcessedDate(systemAdapter, epochMs, 'default');
      const { value: processedValue, ...processed } = processDate(
        systemAdapter.date(new Date(epochMs).toISOString(), 'default'),
        systemAdapter,
      );
      expect(created).to.deep.equal(processed);
      expect(systemAdapter.getTime(value)).to.equal(systemAdapter.getTime(processedValue));
    },
  );

  it('should read the processed date through the adapter for offsets between -01:00 and 00:00', () => {
    // Africa/Monrovia used -00:44:30 until 1972, which TZDate reads as +00:44:30.
    const { value, ...created } = createProcessedDate(adapter, 0, 'Africa/Monrovia');
    const { value: processedValue, ...processed } = processDate(value, adapter);
    expect(created).to.deep.equal(processed);
  });

  describe('createAdapterDateFromWallTime', () => {
    const resolve = (value: string, timezone: string) => {
      const date = createAdapterDateFromWallTime(adapter, value, timezone);
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
      const value = createAdapterDateFromWallTime(adapter, '2025-01-01T09:30:00', 'Asia/Tokyo')!;
      expect(adapter.getTimezone(value)).to.equal('Asia/Tokyo');
      expect(adapter.getHours(value)).to.equal(9);
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
