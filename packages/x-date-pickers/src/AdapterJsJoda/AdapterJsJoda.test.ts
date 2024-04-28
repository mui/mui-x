import { LocalDateTime, ZonedDateTime } from '@js-joda/core';
import { Locale } from '@js-joda/locale_en-us';
import { expect } from 'chai';
import { AdapterJsJoda } from './AdapterJsJoda';

const testDateString = '2024-04-27T11:44:00.000';
const testSundayString = '2024-04-21T11:44:00.000';

describe('<AdapterJsJoda/>', () => {
  const adapter = new AdapterJsJoda({ locale: Locale.ENGLISH });

  it('allows comparisons between zoned and local timestamps', () => {
    // MUI-X and clients may not consistently specify timezones.  We don't want
    // to make them accommodate js-joda's stricter behavior here.
    const t1 = LocalDateTime.parse(testDateString);
    const t2 = ZonedDateTime.parse(`${testDateString}Z`);
    expect(adapter.isEqual(t1, t2)).to.equal(true);
    expect(adapter.isBefore(t1, t2.plusMinutes(1))).to.equal(true);
    expect(adapter.isBefore(t1, t2.minusMinutes(1))).to.equal(false);
    expect(adapter.isAfter(t1, t2.plusMinutes(1))).to.equal(false);
    expect(adapter.isAfter(t1, t2.minusMinutes(1))).to.equal(true);
  });

  it('gets the start of a week', () => {
    let date = adapter.date(testDateString);
    let startOfWeek = adapter.startOfWeek(date);
    expect(startOfWeek.toJSON()).to.equal('2024-04-21T00:00');

    date = adapter.date(testSundayString);
    startOfWeek = adapter.startOfWeek(date);
    expect(startOfWeek.toJSON()).to.equal('2024-04-21T00:00');
  });

  it('gets the week number', () => {
    const date = adapter.date(testDateString);
    const startOfWeek = adapter.startOfWeek(date);
    expect(adapter.getWeekNumber(date)).to.equal(17);
    expect(adapter.getWeekNumber(startOfWeek)).to.equal(17);
  });

  it('gets the day of the week', () => {
    const date = adapter.date(testDateString);
    expect(adapter.getDayOfWeek(date)).to.equal(7);
  });
});
