import { getEventTimelinePremiumStateFromParameters } from 'test/utils/scheduler';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

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
});
