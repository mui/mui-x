import { schedulerPreferenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DEFAULT_SCHEDULER_PREFERENCES } from '@mui/x-scheduler-headless/internals';
import { adapter } from '../index';
import type { SchedulerStoreClassDescriptor } from './types';

/**
 * Shared tests for schedulerPreferenceSelectors.
 * These tests verify the selector functionality that both EventCalendarStore
 * and EventTimelinePremiumStore use through SchedulerStore.
 */
export function describeSchedulerPreferenceSelectorTests(
  storeClass: SchedulerStoreClassDescriptor,
) {
  describe(`schedulerPreferenceSelectors - ${storeClass.name}`, () => {
    describe('all', () => {
      it('should return default preferences when none are set in the state', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const preferences = schedulerPreferenceSelectors.all(state);
        expect(preferences).to.deep.equal(DEFAULT_SCHEDULER_PREFERENCES);
      });

      it('should return custom preferences when they are set in the state', () => {
        const state = new storeClass.Value({ events: [], preferences: { ampm: false } }, adapter)
          .state;
        const preferences = schedulerPreferenceSelectors.all(state);
        expect(preferences).to.deep.equal({ ...DEFAULT_SCHEDULER_PREFERENCES, ampm: false });
      });
    });

    describe('ampm', () => {
      it('should return the default ampm preference when none is set in the state', () => {
        const state = new storeClass.Value({ events: [] }, adapter).state;
        const ampm = schedulerPreferenceSelectors.ampm(state);
        expect(ampm).to.equal(DEFAULT_SCHEDULER_PREFERENCES.ampm);
      });

      it('should return the custom ampm preference when it is set in the state (false)', () => {
        const state = new storeClass.Value({ events: [], preferences: { ampm: false } }, adapter)
          .state;
        const ampm = schedulerPreferenceSelectors.ampm(state);
        expect(ampm).to.equal(false);
      });

      it('should return the custom ampm preference when it is set in the state (true)', () => {
        const state = new storeClass.Value({ events: [], preferences: { ampm: true } }, adapter)
          .state;
        const ampm = schedulerPreferenceSelectors.ampm(state);
        expect(ampm).to.equal(true);
      });
    });
  });
}
