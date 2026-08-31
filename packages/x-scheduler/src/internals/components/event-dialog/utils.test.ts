import { adapter } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { findInvalidRangeField } from './utils';

describe('findInvalidRangeField', () => {
  const base = {
    startDate: '2025-07-01',
    startTime: '10:00',
    endDate: '2025-07-02',
    endTime: '11:00',
    allDay: false,
  };
  const run = (overrides: Partial<typeof base>) =>
    findInvalidRangeField(adapter, { ...base, ...overrides }, 'default');

  describe('date boundaries', () => {
    const validDates = ['2024-02-29', '2000-02-29', '2025-02-28', '2025-01-31', '2025-04-30'];
    const invalidDates = [
      '2025-02-29',
      '1900-02-29',
      '2025-06-31',
      '2025-13-01',
      '2025-00-10',
      '2025-01-00',
      '2025-1-01',
      '20250101',
      '',
    ];

    validDates.forEach((date) => {
      it(`should accept the date ${date}`, () => {
        expect(run({ startDate: date })).to.equal(null);
      });
    });

    invalidDates.forEach((date) => {
      it(`should reject the date ${JSON.stringify(date)}`, () => {
        expect(run({ startDate: date })).to.equal('startDate');
      });
    });
  });

  describe('time boundaries', () => {
    const validTimes = ['00:00', '23:59', '09:30'];
    const invalidTimes = ['24:00', '23:60', '9:00', '10:5', ''];

    validTimes.forEach((time) => {
      it(`should accept the time ${time}`, () => {
        expect(run({ startTime: time })).to.equal(null);
      });
    });

    invalidTimes.forEach((time) => {
      it(`should reject the time ${JSON.stringify(time)}`, () => {
        expect(run({ startTime: time })).to.equal('startTime');
      });
    });

    it('should ignore the time fields of an all-day range', () => {
      expect(run({ startTime: '24:00', allDay: true })).to.equal(null);
    });
  });
});
