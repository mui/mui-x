import { adapter, adapterFr, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import {
  findInvalidRangeField,
  getEditedRangeBounds,
  getRecurrenceRuleBound,
  getRecurrenceTimezoneName,
  getResentRangeBounds,
  getWeekdayToken,
} from './utils';

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
  const genericName = (locale: string, timeZone: string) =>
    new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: 'longGeneric' })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')!.value;

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
      genericName('fr', 'America/Los_Angeles'),
    );
  });

  it('should fall back to the identifier when the runtime only has an offset for it', () => {
    expect(getRecurrenceTimezoneName(adapter, 'UTC', 'America/New_York')).to.equal('UTC');
    // The offset is spelled differently per locale ("UTC+00:00" in French).
    expect(getRecurrenceTimezoneName(adapterFr, 'UTC', 'America/New_York')).to.equal('UTC');
  });

  it('should return null when both timezones are the same', () => {
    expect(getRecurrenceTimezoneName(adapter, 'Asia/Tokyo', 'Asia/Tokyo')).to.equal(null);
  });

  it('should treat aliases of the same timezone as the same', () => {
    expect(getRecurrenceTimezoneName(adapter, 'US/Eastern', 'America/New_York')).to.equal(null);
    expect(getRecurrenceTimezoneName(adapter, 'Etc/UTC', 'UTC')).to.equal(null);
  });

  it('should resolve the adapter aliases to the system timezone', () => {
    expect(getRecurrenceTimezoneName(adapter, 'default', 'system')).to.equal(null);
    expect(getRecurrenceTimezoneName(adapter, 'default', systemTimezone)).to.equal(null);
    expect(getRecurrenceTimezoneName(adapter, 'default', 'Pacific/Kiritimati')).to.not.equal(null);
  });
});

describe('getWeekdayToken', () => {
  it("should read the weekday in the value's own timezone", () => {
    // Monday 01:00 in Tokyo is still Sunday in UTC, the system timezone of the tests.
    expect(getWeekdayToken(adapter, adapter.date('2025-07-07T01:00:00', 'Asia/Tokyo'))).to.equal(
      'monday',
    );
    expect(getWeekdayToken(adapterFr, adapter.date('2025-07-06T12:00:00', 'UTC'))).to.equal(
      'sunday',
    );
  });
});

describe('getResentRangeBounds', () => {
  it('should resend only the edited bound', () => {
    expect(getResentRangeBounds({ startDate: '2025-07-02' }, false, false)).to.deep.equal({
      startResent: true,
      endResent: false,
    });
  });

  it('should resend both bounds when one is edited and the display timezone moved', () => {
    expect(getResentRangeBounds({ endDate: '2025-07-05' }, false, true)).to.deep.equal({
      startResent: true,
      endResent: true,
    });
  });

  it('should resend nothing when the display timezone moved and nothing was edited', () => {
    expect(getResentRangeBounds({}, false, true)).to.deep.equal({
      startResent: false,
      endResent: false,
    });
  });
});

describe('getRecurrenceRuleBound', () => {
  // Friday July 4 00:00 UTC, displayed on Thursday July 3 20:00 in New York.
  const occurrence = EventBuilder.new(adapter)
    .withDataTimezone('UTC')
    .span('2025-07-04T00:00:00', '2025-07-04T01:00:00')
    .withDisplayTimezone('America/New_York')
    .toOccurrence();
  const seeded = {
    startDate: '2025-07-03',
    startTime: '20:00',
    endDate: '2025-07-03',
    endTime: '21:00',
    allDay: false,
  };

  it("should return the occurrence's own bound when it is not resent", () => {
    const start = getRecurrenceRuleBound(
      adapter,
      occurrence,
      seeded,
      false,
      'America/New_York',
      'start',
    );
    expect(start).to.equal(occurrence.dataTimezone.start);
  });

  it("should return the edited bound in the event's timezone when it is resent", () => {
    const start = getRecurrenceRuleBound(
      adapter,
      occurrence,
      { ...seeded, startTime: '10:00' },
      true,
      'America/New_York',
      'start',
    );
    expect(adapter.getTimezone(start.value)).to.equal('UTC');
    expect(adapter.formatByString(start.value, 'yyyy-MM-dd HH:mm')).to.equal('2025-07-03 14:00');
  });

  it("should return the occurrence's own bound while an edited date does not parse", () => {
    const start = getRecurrenceRuleBound(
      adapter,
      occurrence,
      { ...seeded, startDate: '2025-07-' },
      true,
      'America/New_York',
      'start',
    );
    expect(start).to.equal(occurrence.dataTimezone.start);
  });

  it("should return the end of an edited all-day range in the event's timezone", () => {
    const end = getRecurrenceRuleBound(
      adapter,
      occurrence,
      { ...seeded, endDate: '2025-07-05', allDay: true },
      true,
      'America/New_York',
      'end',
    );
    // The end of July 5 in New York is July 6 03:59 UTC.
    expect(adapter.formatByString(end.value, 'yyyy-MM-dd HH:mm')).to.equal('2025-07-06 03:59');
  });

  it('should anchor a creation draft on the default timezone', () => {
    const draft = EventBuilder.new(adapter)
      .id('placeholder-id')
      .span('2025-07-04T00:00:00Z', '2025-07-04T01:00:00Z')
      .withDisplayTimezone('America/New_York')
      .toOccurrence();
    const { dataTimezone, ...placeholder } = draft;
    const start = getRecurrenceRuleBound(
      adapter,
      placeholder,
      seeded,
      false,
      'America/New_York',
      'start',
    );
    // The tests run in UTC, the default timezone: still Friday July 4.
    expect(adapter.formatByString(start.value, 'yyyy-MM-dd HH:mm')).to.equal('2025-07-04 00:00');
  });
});
