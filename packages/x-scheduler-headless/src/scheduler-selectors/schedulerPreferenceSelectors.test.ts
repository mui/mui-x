// import { adapter } from 'test/utils/scheduler';
// import { schedulerPreferenceSelectors } from './schedulerPreferenceSelectors';
// import { storeClasses } from '../utils/SchedulerStore/tests/utils';
// import { DEFAULT_SCHEDULER_PREFERENCES } from '../utils/SchedulerStore';

// storeClasses.forEach((storeClass) => {
//   describe('schedulerPreferenceSelectors', () => {
//     describe('all', () => {
//       it('should return default preferences when none are set in the state', () => {
//         const state = new storeClass.Value({ events: [] }, adapter).state;
//         const preferences = schedulerPreferenceSelectors.all(state);
//         expect(preferences).to.deep.equal(DEFAULT_SCHEDULER_PREFERENCES);
//       });

//       it('should return custom preferences when they are set in the state', () => {
//         const state = new storeClass.Value({ events: [], preferences: { ampm: false } }, adapter)
//           .state;
//         const preferences = schedulerPreferenceSelectors.all(state);
//         expect(preferences).to.deep.equal({ ...DEFAULT_SCHEDULER_PREFERENCES, ampm: false });
//       });
//     });

//     describe('ampm', () => {
//       it('should return the default ampm preference when none is set in the state', () => {
//         const state = new storeClass.Value({ events: [] }, adapter).state;
//         const ampm = schedulerPreferenceSelectors.ampm(state);
//         expect(ampm).to.equal(true);
//       });

//       it('should return the custom ampm preference when it is set in the state', () => {
//         const state = new storeClass.Value({ events: [], preferences: { ampm: false } }, adapter)
//           .state;
//         const ampm = schedulerPreferenceSelectors.ampm(state);
//         expect(ampm).to.equal(false);
//       });
//     });
//   });
// });
