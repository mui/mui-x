import { adapter, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { schedulerPreferenceSelectors } from './schedulerPreferenceSelectors';
import { DEFAULT_SCHEDULER_PREFERENCES } from '../internals/utils/SchedulerStore';

const BASE_PARAMS = { events: [], resources: [ResourceBuilder.new().build()] };

storeClasses.forEach((storeClass) => {
  describe('schedulerPreferenceSelectors', () => {
    describe('all', () => {
      it('should return default preferences when none are set in the state', () => {
        const state = new storeClass.Value({ ...BASE_PARAMS }, adapter).state;
        const preferences = schedulerPreferenceSelectors.all(state);
        expect(preferences).to.deep.equal(DEFAULT_SCHEDULER_PREFERENCES);
      });

      it('should return custom preferences when they are set in the state', () => {
        const state = new storeClass.Value(
          { ...BASE_PARAMS, preferences: { ampm: false } },
          adapter,
        ).state;
        const preferences = schedulerPreferenceSelectors.all(state);
        expect(preferences).to.deep.equal({ ...DEFAULT_SCHEDULER_PREFERENCES, ampm: false });
      });
    });

    describe('ampm', () => {
      it('should follow the hour cycle of the date locale when none is set in the state', () => {
        const state = new storeClass.Value({ ...BASE_PARAMS }, adapter).state;
        expect(schedulerPreferenceSelectors.ampm(state)).to.equal(true);
        const frenchState = new storeClass.Value({ ...BASE_PARAMS, dateLocale: 'fr-FR' }, adapter)
          .state;
        expect(schedulerPreferenceSelectors.ampm(frenchState)).to.equal(false);
      });

      it('should return the custom ampm preference when it is set in the state (false)', () => {
        const state = new storeClass.Value(
          { ...BASE_PARAMS, preferences: { ampm: false } },
          adapter,
        ).state;
        const ampm = schedulerPreferenceSelectors.ampm(state);
        expect(ampm).to.equal(false);
      });

      it('should return the custom ampm preference when it is set in the state (true)', () => {
        const state = new storeClass.Value({ ...BASE_PARAMS, preferences: { ampm: true } }, adapter)
          .state;
        const ampm = schedulerPreferenceSelectors.ampm(state);
        expect(ampm).to.equal(true);
      });
    });

    describe('weekInfo', () => {
      it('should follow the weeks of the date locale when weekStartsOn is not set', () => {
        const state = new storeClass.Value({ ...BASE_PARAMS }, adapter).state;
        expect(schedulerPreferenceSelectors.weekInfo(state)).to.deep.equal({
          firstDay: 7,
          minimalDays: 1,
        });
        const frenchState = new storeClass.Value({ ...BASE_PARAMS, dateLocale: 'fr-FR' }, adapter)
          .state;
        expect(schedulerPreferenceSelectors.weekInfo(frenchState)).to.deep.equal({
          firstDay: 1,
          minimalDays: 4,
        });
      });

      it('should start the weeks on weekStartsOn and keep the first week of the locale', () => {
        const state = new storeClass.Value(
          { ...BASE_PARAMS, preferences: { weekStartsOn: 1 } },
          adapter,
        ).state;
        expect(schedulerPreferenceSelectors.weekInfo(state)).to.deep.equal({
          firstDay: 1,
          minimalDays: 1,
        });
      });
    });
  });
});
