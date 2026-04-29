import { adapter, getEventTimelinePremiumStateFromParameters } from 'test/utils/scheduler';
import {
  EventTimelinePremiumPreset,
  PresetHeaderUnit,
} from '@mui/x-scheduler-headless-premium/models';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const VISIBLE_DATE = adapter.date('2025-07-03T00:00:00Z', 'default');

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
  describe('preset', () => {
    it('should return the preset from state', () => {
      const state = getEventTimelinePremiumStateFromParameters({
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
        events: [],
        preset: 'dayAndHour',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.unitCount).to.equal(4 * 24);
      expect(config.start).toEqualDateTime('2025-07-03T00:00:00Z');
      expect(config.end).toEqualDateTime('2025-07-06T23:59:59.999Z');
    });

    it('should return the configuration for the dayAndMonth preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'dayAndMonth',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.unitCount).to.equal(8 * 7);
      expect(config.start).toEqualDateTime('2025-07-03T00:00:00Z');
      expect(config.end).toEqualDateTime('2025-08-27T23:59:59.999Z');
    });

    it('should return the configuration for the dayAndWeek preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'dayAndWeek',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      // CSS ticks use the preset's `timeResolution` (days here); 16 weeks → 112 days.
      expect(config.unitCount).to.equal(16 * 7);
      // July 3, 2025 is a Thursday → week starts Monday June 30
      expect(config.start).toEqualDateTime(adapter.startOfWeek(VISIBLE_DATE));
      expect(config.end).toEqualDateTime(
        adapter.endOfWeek(adapter.addWeeks(adapter.startOfWeek(VISIBLE_DATE), 15)),
      );
    });

    it('should return the configuration for the monthAndYear preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'monthAndYear',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      // 36 months starting July 2025 → June 2028.
      // 184 (Jul-Dec 2025) + 365 + 365 + 182 (Jan-Jun 2028, leap) = 1096 days.
      expect(config.start).toEqualDateTime('2025-07-01T00:00:00Z');
      expect(config.end).toEqualDateTime('2028-06-30T23:59:59.999Z');
      expect(config.unitCount).to.equal(1096);
    });

    it('should compute a variable unitCount for monthAndYear based on the days of each month in range', () => {
      // Both ranges span the same 36 months starting in January, but the 2024 window contains
      // the 2024 leap day (Feb 29) while the 2025 window does not.
      const leapStart = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'monthAndYear',
        visibleDate: adapter.date('2024-01-15T00:00:00Z', 'default'),
      });
      const nonLeapStart = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'monthAndYear',
        visibleDate: adapter.date('2025-01-15T00:00:00Z', 'default'),
      });

      const leapConfig = eventTimelinePremiumPresetSelectors.config(leapStart);
      const nonLeapConfig = eventTimelinePremiumPresetSelectors.config(nonLeapStart);

      expect(leapConfig.unitCount).to.equal(nonLeapConfig.unitCount + 1);
    });

    it('should return the configuration for the year preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'year',
        visibleDate: VISIBLE_DATE,
      });

      const config = eventTimelinePremiumPresetSelectors.config(state);

      expect(config.unitCount).to.equal(30);
      expect(config.start).toEqualDateTime('2025-01-01T00:00:00Z');
      expect(config.end).toEqualDateTime('2054-12-31T23:59:59.999Z');
    });

    it('should return the same reference when the dependencies are unchanged', () => {
      const state = getEventTimelinePremiumStateFromParameters({
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
