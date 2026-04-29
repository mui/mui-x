import { adapter, getEventTimelinePremiumStateFromParameters } from 'test/utils/scheduler';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const VISIBLE_DATE = adapter.date('2025-07-03T00:00:00Z', 'default');

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
        presets: ['dayAndHour', 'day'],
      });
      const presets = eventTimelinePremiumPresetSelectors.presets(state);
      expect(presets).to.deep.equal(['dayAndHour', 'day']);
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

    it('should return the configuration for the day preset', () => {
      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        preset: 'day',
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

      expect(config.unitCount).to.equal(16);
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

      // 36 months starting July 2025 → June 2028
      expect(config.start).toEqualDateTime('2025-07-01T00:00:00Z');
      expect(config.end).toEqualDateTime('2028-06-30T23:59:59.999Z');
      // unitCount is computed from differenceInDays(end, start) + 1
      expect(config.unitCount).to.equal(adapter.differenceInDays(config.end, config.start) + 1);
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
        preset: 'day',
        visibleDate: VISIBLE_DATE,
      });

      const first = eventTimelinePremiumPresetSelectors.config(state);
      const second = eventTimelinePremiumPresetSelectors.config(state);

      expect(first).to.equal(second);
    });
  });
});
