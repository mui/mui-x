import { adapter, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { BaseTemporal } from '@mui/x-scheduler-internals/internals';
import { EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS, getPresetPxPerDay } from './preset-utils';
import type { EventTimelinePremiumPreset } from '../../models';

describe('EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS', () => {
  describe('dayAndHour.getCssUnitCount', () => {
    it('should pin the tick count to 4 days × 24 hours', () => {
      // The displayed hour window scales this in the preset selector, so the preset
      // always sizes the full day.
      const count = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndHour.getCssUnitCount!(
        BaseTemporal.PlainDate.from('2025-07-03'),
        BaseTemporal.PlainDate.from('2025-07-07'),
      );
      expect(count).to.equal(4 * 24);
    });
  });

  describe('getStartPlainDate and getEndPlainDate', () => {
    it.each([
      { preset: 'dayAndHour', start: '2025-07-03', end: '2025-07-07' },
      { preset: 'dayAndMonth', start: '2025-07-03', end: '2025-08-28' },
      // July 3rd, 2025 is a Thursday, and the weeks start on Monday.
      { preset: 'dayAndWeek', start: '2025-06-30', end: '2025-10-20' },
      { preset: 'monthAndYear', start: '2025-07-01', end: '2028-07-01' },
      { preset: 'year', start: '2025-01-01', end: '2055-01-01' },
    ] as const)(
      'should start $preset on the first date of the period of the visible date and end it after its periods',
      ({ preset, start, end }) => {
        const definition = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset];
        const startPlainDate = definition.getStartPlainDate(
          BaseTemporal.PlainDate.from('2025-07-03'),
          1,
        );
        expect(startPlainDate).toEqualPlainDate(start);
        expect(definition.getEndPlainDate(startPlainDate, definition.unitCount)).toEqualPlainDate(
          end,
        );
      },
    );
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
