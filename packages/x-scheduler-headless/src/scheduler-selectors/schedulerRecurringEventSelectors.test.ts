import { adapter, premiumStoreClasses } from 'test/utils/scheduler';
import { SchedulerProcessedEventRecurrenceRule } from '@mui/x-scheduler-headless/models';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { schedulerRecurringEventSelectors } from './schedulerRecurringEventSelectors';
import { getWeekDayCode } from '../internals/utils/recurring-events';

describe.for(premiumStoreClasses.map((storeClass) => [storeClass.name, storeClass] as const))(
  `Recurring event - %s`,
  ([, storeClass]) => {
    describe('Selector: recurrencePresets', () => {
      const state = new storeClass.Value({ events: [] }, adapter).state;

      it('returns daily, weekly, monthly and yearly presets', () => {
        const start = processDate(adapter.date('2025-08-05T09:00:00Z', 'default'), adapter); // Tuesday
        const presets = schedulerRecurringEventSelectors.presets(state, start);

        expect(presets.DAILY).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
        expect(presets.WEEKLY).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: [getWeekDayCode(adapter, start.value)],
        });
        expect(presets.MONTHLY).to.deep.equal({
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [5],
        });
        expect(presets.YEARLY).to.deep.equal({
          freq: 'YEARLY',
          interval: 1,
        });
      });
    });

    describe('Selector: defaultRecurrencePresetKey', () => {
      const state = new storeClass.Value({ events: [] }, adapter).state;
      const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter); // Tuesday
      const presets = schedulerRecurringEventSelectors.presets(state, start);

      it('returns null when rule undefined', () => {
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, undefined, start)).to.equal(
          null,
        );
      });

      it('detects daily, weekly, monthly and yearly presets', () => {
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.DAILY, start),
        ).to.equal('DAILY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.WEEKLY, start),
        ).to.equal('WEEKLY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.MONTHLY, start),
        ).to.equal('MONTHLY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.YEARLY, start),
        ).to.equal('YEARLY');
      });

      it('classifies daily interval>1 or with finite end (count) as custom', () => {
        const ruleInterval2: SchedulerProcessedEventRecurrenceRule = {
          ...presets.DAILY,
          interval: 2,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, start),
        ).to.equal('custom');

        const ruleFiniteCount: SchedulerProcessedEventRecurrenceRule = {
          ...presets.DAILY,
          count: 5,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleFiniteCount, start),
        ).to.equal('custom');
      });

      it('classifies weekly with extra day as custom', () => {
        const rule: SchedulerProcessedEventRecurrenceRule = {
          ...presets.WEEKLY,
          byDay: ['TU', 'WE'],
        };
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
          'custom',
        );
      });

      it('classifies monthly with different day or with interval>1 as custom', () => {
        const ruleDifferentDay: SchedulerProcessedEventRecurrenceRule = {
          ...presets.MONTHLY,
          byMonthDay: [26],
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleDifferentDay, start),
        ).to.equal('custom');

        const ruleInterval2: SchedulerProcessedEventRecurrenceRule = {
          ...presets.MONTHLY,
          interval: 2,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, start),
        ).to.equal('custom');
      });

      it('classifies yearly interval>1 as custom', () => {
        const rule: SchedulerProcessedEventRecurrenceRule = { ...presets.YEARLY, interval: 2 };
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
          'custom',
        );
      });
    });
  },
);
