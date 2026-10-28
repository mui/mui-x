import {
  adapter,
  getEventTimelinePremiumStateFromParameters,
  ResourceBuilder,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import type {
  EventTimelinePremiumPreset,
  PresetHeaderUnit,
} from '@mui/x-scheduler-internals-premium/models';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { describe, it, expect, beforeEach } from 'vitest';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const VISIBLE_DATE = adapter.date('2025-07-03T00:00:00Z', 'default');
const TEST_RESOURCES = [ResourceBuilder.new().build()];

const PRESET_SHAPE: Record<
  EventTimelinePremiumPreset,
  { tickWidth: number; headerUnits: PresetHeaderUnit[] }
> = {
  dayAndHour: { tickWidth: 64, headerUnits: ['day', 'hour'] },
  dayAndMonth: { tickWidth: 120, headerUnits: ['month', 'day'] },
  dayAndWeek: { tickWidth: 64, headerUnits: ['week', 'day'] },
  monthAndYear: { tickWidth: 6, headerUnits: ['year', 'month'] },
  year: { tickWidth: 200, headerUnits: ['year'] },
};

describe('eventTimelinePremiumPresetSelectors', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  describe('preset', () => {
    it('should return the preset from state', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'monthAndYear',
      });
      const preset = eventTimelinePremiumPresetSelectors.preset(state);
      expect(preset).to.equal('monthAndYear');
    });
  });

  describe('presets', () => {
    it('should return the presets from state', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        presets: ['dayAndHour', 'dayAndMonth'],
      });
      const presets = eventTimelinePremiumPresetSelectors.presets(state);
      expect(presets).to.deep.equal(['dayAndHour', 'dayAndMonth']);
    });
  });

  describe('config', () => {
    it('should return the configuration for the dayAndHour preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.tickCount).to.equal(4 * 24);
      expect(new Date(config.start)).toEqualDateTime('2025-07-03T00:00:00Z');
      expect(new Date(config.end)).toEqualDateTime('2025-07-06T23:59:59.999Z');
    });

    it('should return the configuration for the dayAndMonth preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndMonth',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.tickCount).to.equal(8 * 7);
      expect(new Date(config.start)).toEqualDateTime('2025-07-03T00:00:00Z');
      expect(new Date(config.end)).toEqualDateTime('2025-08-27T23:59:59.999Z');
    });

    it('should return the configuration for the dayAndWeek preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndWeek',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      // CSS ticks use the preset's `timeResolution` (days here); 16 weeks → 112 days.
      expect(config.tickCount).to.equal(16 * 7);
      // July 3, 2025 is a Thursday → week starts Monday June 30
      expect(new Date(config.start)).toEqualDateTime(adapter.startOfWeek(VISIBLE_DATE));
      expect(new Date(config.end)).toEqualDateTime(
        adapter.endOfWeek(adapter.addWeeks(adapter.startOfWeek(VISIBLE_DATE), 15)),
      );
    });

    it('should return the configuration for the monthAndYear preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'monthAndYear',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      // 36 months starting July 2025 → June 2028.
      // 184 (Jul-Dec 2025) + 365 + 365 + 182 (Jan-Jun 2028, leap) = 1096 days.
      expect(new Date(config.start)).toEqualDateTime('2025-07-01T00:00:00Z');
      expect(new Date(config.end)).toEqualDateTime('2028-06-30T23:59:59.999Z');
      expect(config.tickCount).to.equal(1096);
    });

    it('should compute a variable tickCount for monthAndYear based on the days of each month in range', () => {
      // Both ranges span the same 36 months starting in January, but the 2024 window contains
      // the 2024 leap day (Feb 29) while the 2025 window does not.
      const leapStart = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'monthAndYear',
        visibleDate: adapter.date('2024-01-15T00:00:00Z', 'default'),
      });
      const nonLeapStart = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'monthAndYear',
        visibleDate: adapter.date('2025-01-15T00:00:00Z', 'default'),
      });

      const leapConfig = eventTimelinePremiumPresetSelectors.config(leapStart);
      const nonLeapConfig = eventTimelinePremiumPresetSelectors.config(nonLeapStart);

      expect(leapConfig.tickCount).to.equal(nonLeapConfig.tickCount + 1);
    });

    it('should return the configuration for the year preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'year',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.tickCount).to.equal(30);
      expect(new Date(config.start)).toEqualDateTime('2025-01-01T00:00:00Z');
      expect(new Date(config.end)).toEqualDateTime('2054-12-31T23:59:59.999Z');
    });

    it('should expose the full-day hour window when no presetConfig is provided', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.dayStartMinute).to.equal(0);
      expect(config.dayEndMinute).to.equal(24 * 60);
      expect(config.durationMs).to.equal(4 * 24 * 60 * 60_000);
    });

    it('should trim the tickCount and expose the hour window when the dayAndHour preset has a startTime / endTime', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
        presetConfig: { dayAndHour: { startTime: 8, endTime: 20 } },
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.tickCount).to.equal(4 * 12);
      expect(config.dayStartMinute).to.equal(8 * 60);
      expect(config.dayEndMinute).to.equal(20 * 60);
      // Precomputed once here so per-row hooks do not re-derive it on every render.
      expect(config.durationMs).to.equal(4 * 12 * 60 * 60_000);
      // The range itself stays midnight-based: only the rendered hours are trimmed.
      expect(new Date(config.start)).toEqualDateTime('2025-07-03T00:00:00Z');
      expect(new Date(config.end)).toEqualDateTime('2025-07-06T23:59:59.999Z');
    });

    it('should warn and fall back to the full day when the hour range is invalid', () => {
      // The warning fires eagerly when the state is derived from the parameters,
      // independent of the preset being rendered.
      let state: ReturnType<typeof getEventTimelinePremiumStateFromParameters>;
      expect(() => {
        state = getEventTimelinePremiumStateFromParameters({
          resources: TEST_RESOURCES,
          events: [],
          preset: 'dayAndHour',
          visibleDate: VISIBLE_DATE,
          presetConfig: { dayAndHour: { startTime: 20, endTime: 8 } },
        });
      }).toWarnDev(['MUI X Scheduler: `presetConfig.dayAndHour` received an invalid hour range']);

      const config = eventTimelinePremiumPresetSelectors.config(state!);

      expect(config.tickCount).to.equal(4 * 24);
      expect(config.dayStartMinute).to.equal(0);
      expect(config.dayEndMinute).to.equal(24 * 60);
    });

    it('should ignore the hour range on presets whose timeResolution is not hour', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndMonth',
        visibleDate: VISIBLE_DATE,
        presetConfig: { dayAndHour: { startTime: 8, endTime: 20 } },
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.tickCount).to.equal(8 * 7);
      expect(config.dayStartMinute).to.equal(0);
      expect(config.dayEndMinute).to.equal(24 * 60);
    });

    it('should throw with the MUI X error message when the preset has no registered config', () => {
      // The state.preset field is typed via the EventTimelinePremiumPreset union, so reaching
      // this branch requires casting. Locks in the unconditional throw (vs. a destructure
      // TypeError) for the scenario where a future API allows registering custom presets.
      const validState = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
      });
      const invalidState = {
        ...validState,
        preset: 'unknownPreset' as EventTimelinePremiumPreset,
      };

      expect(() => eventTimelinePremiumPresetSelectors.config(invalidState)).to.throw(
        /MUI X Scheduler: No configuration registered for preset "unknownPreset"/,
      );
    });

    it('should keep the config identity when a fresh but equal presetConfig object is passed', () => {
      const base = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
        presetConfig: { dayAndHour: { startTime: 8, endTime: 20 } },
      });

      const first = eventTimelinePremiumPresetSelectors.config(base);
      // An inline literal produces a fresh object with equal values on every parent
      // render; the memoization must survive it or every render re-expands the
      // occurrence pipeline downstream.
      const second = eventTimelinePremiumPresetSelectors.config({
        ...base,
        presetConfig: { dayAndHour: { startTime: 8, endTime: 20 } },
      });

      expect(second).to.equal(first);
    });

    it('should read the visible date in the display timezone', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndMonth',
        // July 1st at midnight in UTC is June 30th at 20:00 in New York.
        visibleDate: adapter.date('2025-07-01T00:00:00', 'UTC'),
        displayTimezone: 'America/New_York',
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      // From June 30th to August 24th in New York.
      expect(new Date(config.start).toISOString()).to.equal('2025-06-30T04:00:00.000Z');
      expect(new Date(config.end).toISOString()).to.equal('2025-08-25T03:59:59.999Z');
      expect(config.timezone).to.equal('America/New_York');
    });

    it.each([
      // The week of December 31st, 2022 in New York starts on Sunday the 25th.
      { preset: 'dayAndWeek', startPlainDate: '2022-12-25', start: '2022-12-25T05:00:00.000Z' },
      { preset: 'monthAndYear', startPlainDate: '2022-12-01', start: '2022-12-01T05:00:00.000Z' },
      { preset: 'year', startPlainDate: '2022-01-01', start: '2022-01-01T05:00:00.000Z' },
    ] as const)(
      'should read the visible date in the display timezone in the $preset preset',
      ({ preset, startPlainDate, start }) => {
        const state = getEventTimelinePremiumStateFromParameters({
          resources: TEST_RESOURCES,
          events: [],
          preset,
          // January 1st, 2023 at midnight in UTC is December 31st, 2022 at 19:00 in New York.
          visibleDate: adapter.date('2023-01-01T00:00:00', 'UTC'),
          displayTimezone: 'America/New_York',
        });

        const config = eventTimelinePremiumPresetSelectors.config(state);

        expect(config.startPlainDate).toEqualPlainDate(startPlainDate);
        expect(new Date(config.start).toISOString()).to.equal(start);
      },
    );

    describe('bounds across DST transitions', () => {
      const getBounds = (
        preset: EventTimelinePremiumPreset,
        visibleDate: string,
        displayTimezone: string,
      ) => {
        const state = getEventTimelinePremiumStateFromParameters({
          resources: TEST_RESOURCES,
          events: [],
          preset,
          visibleDate: adapter.date(visibleDate, displayTimezone),
          displayTimezone,
        });
        const config = eventTimelinePremiumPresetSelectors.config(state);
        return [new Date(config.start).toISOString(), new Date(config.end).toISOString()];
      };

      // Browsers cannot change their timezone through process.env.TZ.
      it.skipIf(!isJSDOM)(
        'should start the range at the first instant of the day, whatever the timezone of the system',
        () => {
          setSystemTimezone('Australia/Lord_Howe');
          // Santiago leaves summer time at the end of April 4th, 2026, when 24:00 becomes 23:00.
          expect(getBounds('dayAndHour', '2026-04-05T12:00:00', 'America/Santiago')[0]).to.equal(
            '2026-04-05T04:00:00.000Z',
          );
        },
      );

      it.skipIf(!isJSDOM)(
        'should start the range at the first instant of a midnight a DST transition repeats',
        () => {
          setSystemTimezone('America/Los_Angeles');
          // Havana leaves summer time on November 1st, 2026, when 01:00 becomes 00:00 again.
          expect(getBounds('monthAndYear', '2026-11-15T12:00:00', 'America/Havana')[0]).to.equal(
            '2026-11-01T04:00:00.000Z',
          );
        },
      );

      it('should end the range just before the next day starts when its last hour is repeated', () => {
        // Santiago repeats the 23:00 hour of April 4th, 2026.
        expect(getBounds('dayAndHour', '2026-04-01T00:00:00', 'America/Santiago')[1]).to.equal(
          '2026-04-05T03:59:59.999Z',
        );
      });

      it('should end the range just before the next day starts when its timezone skips its last day', () => {
        // Kiritimati skipped December 31st, 1994, when it moved across the date line.
        expect(getBounds('dayAndHour', '1994-12-28T12:00:00', 'Pacific/Kiritimati')[1]).to.equal(
          '1994-12-31T09:59:59.999Z',
        );
      });

      it('should give a day of the axis to each date of the range, even one its timezone skips', () => {
        // Kiritimati skipped December 31st, 1994, the last date of the range, which the header
        // shows and the grid sizes.
        const state = getEventTimelinePremiumStateFromParameters({
          resources: TEST_RESOURCES,
          events: [],
          preset: 'dayAndHour',
          visibleDate: adapter.date('1994-12-28T12:00:00', 'Pacific/Kiritimati'),
          displayTimezone: 'Pacific/Kiritimati',
        });
        const config = eventTimelinePremiumPresetSelectors.config(state);
        expect(config.endPlainDate).toEqualPlainDate('1995-01-01');
        expect(config.tickCount).to.equal(4 * 24);
        expect(config.durationMs).to.equal(4 * 24 * 3_600_000);
      });

      // Browsers cannot change their timezone through process.env.TZ.
      it.skipIf(!isJSDOM)(
        'should read the range in the timezone of the system when the display timezone is the default one',
        () => {
          // Apia skipped December 30th, 2011, when it moved from UTC−10 to UTC+14.
          setSystemTimezone('Pacific/Apia');
          expect(getBounds('dayAndHour', '2011-12-29T12:00:00', 'default')).to.deep.equal([
            '2011-12-29T10:00:00.000Z',
            '2012-01-01T09:59:59.999Z',
          ]);
        },
      );
    });

    it('should return the same reference when the dependencies are unchanged', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [],
        preset: 'dayAndMonth',
        visibleDate: VISIBLE_DATE,
      });

      const first = eventTimelinePremiumPresetSelectors.config(state);
      const second = eventTimelinePremiumPresetSelectors.config(state);

      expect(first).to.equal(second);
    });

    (Object.keys(PRESET_SHAPE) as EventTimelinePremiumPreset[]).forEach((preset) => {
      it(`should expose tickWidth and headers for the ${preset} preset`, () => {
        const state = getEventTimelinePremiumStateFromParameters({
          resources: TEST_RESOURCES,
          events: [],
          preset,
          visibleDate: VISIBLE_DATE,
        });

        const config = eventTimelinePremiumPresetSelectors.config(state);

        expect(config.tickWidth).to.equal(PRESET_SHAPE[preset].tickWidth);
        expect(config.headers.map((level) => level.unit)).to.deep.equal(
          PRESET_SHAPE[preset].headerUnits,
        );
      });
    });
  });
});
