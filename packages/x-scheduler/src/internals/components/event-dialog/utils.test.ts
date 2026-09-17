import { adapter, adapterFr } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { findInvalidRangeField, getEditedRangeBounds, getRecurrenceTimezoneName } from './utils';

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

describe('getEditedRangeBounds', () => {
  it('should report no edited bound when no range key is dirty', () => {
    expect(getEditedRangeBounds({ title: 'Renamed' }, false)).to.deep.equal({
      startEdited: false,
      endEdited: false,
    });
  });

  it('should report only the bound whose date was edited', () => {
    expect(getEditedRangeBounds({ endDate: '2025-07-05' }, false)).to.deep.equal({
      startEdited: false,
      endEdited: true,
    });
    expect(getEditedRangeBounds({ startDate: '2025-07-01' }, true)).to.deep.equal({
      startEdited: true,
      endEdited: false,
    });
  });

  it('should count a time edit only when the range is not all-day', () => {
    expect(getEditedRangeBounds({ startTime: '09:00' }, false)).to.deep.equal({
      startEdited: true,
      endEdited: false,
    });
    expect(getEditedRangeBounds({ endTime: '10:00' }, false)).to.deep.equal({
      startEdited: false,
      endEdited: true,
    });
    // A time left over from toggling all-day off and back on is orphaned: the
    // submitted all-day range never reads it.
    expect(getEditedRangeBounds({ startTime: '09:00' }, true)).to.deep.equal({
      startEdited: false,
      endEdited: false,
    });
    expect(getEditedRangeBounds({ endTime: '10:00' }, true)).to.deep.equal({
      startEdited: false,
      endEdited: false,
    });
  });

  it('should mark both bounds edited when the all-day mode itself changed', () => {
    expect(getEditedRangeBounds({ allDay: false }, false)).to.deep.equal({
      startEdited: true,
      endEdited: true,
    });
  });
});

describe('getRecurrenceTimezoneName', () => {
  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  it("should name the event's timezone when it is not the display one", () => {
    expect(getRecurrenceTimezoneName(adapter, 'America/Los_Angeles', 'Europe/Paris')).to.equal(
      'Pacific Time',
    );
    expect(getRecurrenceTimezoneName(adapter, 'Asia/Tokyo', 'Europe/Paris')).to.equal(
      'Japan Standard Time',
    );
  });

  it('should name the timezone in the adapter locale', () => {
    expect(getRecurrenceTimezoneName(adapterFr, 'America/Los_Angeles', 'Europe/Paris')).to.equal(
      'heure du Pacifique nord-américain',
    );
  });

  it('should fall back to the identifier when the runtime only has an offset for it', () => {
    expect(getRecurrenceTimezoneName(adapter, 'UTC', 'America/New_York')).to.equal('UTC');
  });

  it('should return null when both timezones are the same', () => {
    expect(getRecurrenceTimezoneName(adapter, 'Asia/Tokyo', 'Asia/Tokyo')).to.equal(null);
  });

  it('should resolve the adapter aliases to the system timezone', () => {
    expect(getRecurrenceTimezoneName(adapter, 'default', 'system')).to.equal(null);
    expect(getRecurrenceTimezoneName(adapter, 'default', systemTimezone)).to.equal(null);
    expect(getRecurrenceTimezoneName(adapter, 'default', 'Pacific/Kiritimati')).to.not.equal(null);
  });
});
