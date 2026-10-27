import { adapter, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS, getPresetPxPerDay } from './preset-utils';
import type { EventTimelinePremiumPreset } from '../../models';

describe('EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS', () => {
  describe('dayAndHour.getCssUnitCount', () => {
    const start = adapter.date('2025-07-03T00:00:00Z', 'default');
    const end = adapter.endOfDay(adapter.addDays(start, 3));

    it('should pin the tick count to 4 days × 24 hours', () => {
      // The displayed hour window scales this in the preset selector, so the preset
      // always sizes the full day.
      const count = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndHour.getCssUnitCount!(
        adapter,
        start,
        end,
      );
      expect(count).to.equal(4 * 24);
    });
  });

  describe('getStartDate', () => {
    it.skipIf(!isJSDOM)(
      'should start the range at the first instant of the day, whatever the timezone of the system',
      () => {
        setSystemTimezone('Australia/Lord_Howe');
        // Santiago leaves summer time at the end of April 4th, 2026, when 24:00 becomes 23:00.
        const visibleDate = adapter.date('2026-04-05T12:00:00', 'America/Santiago');
        const start = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndHour.getStartDate(
          adapter,
          visibleDate,
          1,
        );
        expect(adapter.toJsDate(start).toISOString()).to.equal('2026-04-05T04:00:00.000Z');
      },
    );

    it.skipIf(!isJSDOM)(
      'should start the range at the first instant of a midnight a DST transition repeats',
      () => {
        setSystemTimezone('America/Los_Angeles');
        // Havana leaves summer time on November 1st, 2026, when 01:00 becomes 00:00 again.
        const visibleDate = adapter.date('2026-11-15T12:00:00', 'America/Havana');
        const start = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.monthAndYear.getStartDate(
          adapter,
          visibleDate,
          1,
        );
        expect(adapter.toJsDate(start).toISOString()).to.equal('2026-11-01T04:00:00.000Z');
      },
    );
  });

  describe('getEndDate', () => {
    it.skipIf(!isJSDOM)(
      'should end the range just before the next day starts when its last hour is repeated',
      () => {
        setSystemTimezone('UTC');
        // Santiago repeats the 23:00 hour of April 4th, 2026.
        const start = adapter.date('2026-04-01T00:00:00', 'America/Santiago');
        const end = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndHour.getEndDate(
          adapter,
          start,
          4,
          1,
        );
        expect(adapter.toJsDate(end).toISOString()).to.equal('2026-04-05T03:59:59.999Z');
      },
    );

    it.skipIf(!isJSDOM)(
      'should end a week on its last day when the timezone of the system skips a day of it',
      () => {
        // Apia skipped December 30th, 2011, when it moved across the date line.
        setSystemTimezone('Pacific/Apia');
        const start = adapter.date('2011-12-24T00:00:00', 'America/New_York');
        const end = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndWeek.getEndDate(
          adapter,
          start,
          1,
          6,
        );
        expect(adapter.toJsDate(end).toISOString()).to.equal('2011-12-31T04:59:59.999Z');
      },
    );

    it.skipIf(!isJSDOM)(
      'should end a month on its last day when the timezone of the system has the same DST transition',
      () => {
        setSystemTimezone('Europe/Paris');
        // Nuuk leaves summer time at the same instant as Paris, when 23:00 on October 30th, 2021
        // becomes 22:00 again.
        const start = adapter.date('2021-10-01T00:00:00', 'America/Nuuk');
        const end = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.monthAndYear.getEndDate(
          adapter,
          start,
          1,
          1,
        );
        expect(adapter.toJsDate(end).toISOString()).to.equal('2021-11-01T02:59:59.999Z');
      },
    );

    it('should end a year just before the next one starts when its timezone skips its last day', () => {
      // Kiritimati skipped December 31st, 1994, when it moved across the date line.
      const start = adapter.date('1994-01-01T00:00:00', 'Pacific/Kiritimati');
      const end = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.year.getEndDate(adapter, start, 1, 1);
      expect(adapter.toJsDate(end).toISOString()).to.equal('1994-12-31T09:59:59.999Z');
    });
  });

  describe('navigate', () => {
    it.skipIf(!isJSDOM).each([
      { preset: 'dayAndHour', visibleDate: '2026-10-24T02:00:00' },
      { preset: 'dayAndWeek', visibleDate: '2026-10-18T02:00:00' },
      { preset: 'monthAndYear', visibleDate: '2026-09-25T02:00:00' },
      { preset: 'year', visibleDate: '2025-10-25T02:00:00' },
    ] as const)(
      'should keep the time of day of the visible date of $preset, whatever the timezone of the system',
      ({ preset, visibleDate }) => {
        setSystemTimezone('Europe/Paris');
        // London leaves summer time on October 25th, 2026, when 02:00 becomes 01:00 again.
        const nextVisibleDate = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset].navigate(
          adapter,
          adapter.date(visibleDate, 'Europe/London'),
          1,
        );
        expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal(
          '2026-10-25T02:00:00.000Z',
        );
      },
    );

    it.skipIf(!isJSDOM).each([
      { preset: 'dayAndHour', visibleDate: '2026-10-24T02:30:00' },
      { preset: 'dayAndWeek', visibleDate: '2026-10-18T02:30:00' },
      { preset: 'monthAndYear', visibleDate: '2026-09-25T02:30:00' },
      { preset: 'year', visibleDate: '2025-10-25T02:30:00' },
    ] as const)(
      'should move the visible date of $preset to the first instant of a time a DST transition repeats',
      ({ preset, visibleDate }) => {
        setSystemTimezone('UTC');
        // Paris leaves summer time on October 25th, 2026, when 03:00 becomes 02:00 again.
        const nextVisibleDate = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset].navigate(
          adapter,
          adapter.date(visibleDate, 'Europe/Paris'),
          1,
        );
        expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal(
          '2026-10-25T00:30:00.000Z',
        );
      },
    );

    it.skipIf(!isJSDOM).each([
      { preset: 'dayAndHour', visibleDate: '2027-03-27T02:30:00' },
      { preset: 'dayAndWeek', visibleDate: '2027-03-21T02:30:00' },
      { preset: 'monthAndYear', visibleDate: '2027-02-28T02:30:00' },
      { preset: 'year', visibleDate: '2026-03-28T02:30:00' },
    ] as const)(
      'should move the visible date of $preset forward by the length of the gap when a DST transition skips its time',
      ({ preset, visibleDate }) => {
        setSystemTimezone('Europe/London');
        // Paris enters summer time on March 28th, 2027, when 02:00 becomes 03:00.
        const nextVisibleDate = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset].navigate(
          adapter,
          adapter.date(visibleDate, 'Europe/Paris'),
          1,
        );
        expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal(
          '2027-03-28T01:30:00.000Z',
        );
      },
    );
  });
});

describe('getPresetPxPerDay', () => {
  // Concrete values prove the derivation formula `tickWidth × ticksPerDay[timeResolution]`
  // rather than the incidental fact that the canonical zoom order happens to match alphabetical
  // for the built-in presets.
  it('should return tickWidth × 24 for hour-resolution presets', () => {
    expect(getPresetPxPerDay('dayAndHour')).to.equal(64 * 24);
  });

  it('should return tickWidth for day-resolution presets', () => {
    expect(getPresetPxPerDay('dayAndMonth')).to.equal(120);
    expect(getPresetPxPerDay('dayAndWeek')).to.equal(64);
    expect(getPresetPxPerDay('monthAndYear')).to.equal(6);
  });

  it('should return tickWidth / 365 for year-resolution presets', () => {
    expect(getPresetPxPerDay('year')).to.be.closeTo(200 / 365, 0.001);
  });

  it('should rank presets monotonically from most to least zoomed-in', () => {
    expect(getPresetPxPerDay('dayAndHour')).to.be.greaterThan(getPresetPxPerDay('dayAndMonth'));
    expect(getPresetPxPerDay('dayAndMonth')).to.be.greaterThan(getPresetPxPerDay('dayAndWeek'));
    expect(getPresetPxPerDay('dayAndWeek')).to.be.greaterThan(getPresetPxPerDay('monthAndYear'));
    expect(getPresetPxPerDay('monthAndYear')).to.be.greaterThan(getPresetPxPerDay('year'));
  });

  // The store sorts presets by `getPresetPxPerDay` to derive the canonical zoom order; ties
  // would make the sort non-deterministic. This assertion catches future presets that
  // accidentally share a px/day with an existing one before they reach the store.
  it('should produce a unique value for every registered preset', () => {
    const presets = Object.keys(
      EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS,
    ) as EventTimelinePremiumPreset[];
    const values = presets.map(getPresetPxPerDay);
    expect(new Set(values).size).to.equal(presets.length);
  });
});
