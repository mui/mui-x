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
  });

  describe('navigate', () => {
    it.skipIf(!isJSDOM)(
      'should keep the time of day of the visible date, whatever the timezone of the system',
      () => {
        setSystemTimezone('Europe/Paris');
        const visibleDate = adapter.date('2026-10-24T02:00:00', 'Europe/London');
        // London leaves summer time on October 25th, 2026, when 02:00 becomes 01:00 again.
        const nextVisibleDate = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS.dayAndHour.navigate(
          adapter,
          visibleDate,
          1,
        );
        expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal(
          '2026-10-25T02:00:00.000Z',
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
