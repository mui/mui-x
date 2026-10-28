import { adapter, premiumStoreClasses } from 'test/utils/scheduler';
import type { SchedulerProcessedEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
import { PlainDate } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';
import { schedulerRecurringEventSelectors } from './schedulerRecurringEventSelectors';

describe.for(premiumStoreClasses.map((storeClass) => [storeClass.name, storeClass] as const))(
  `Recurring event - %s`,
  ([, storeClass]) => {
    describe('Selector: recurrencePresets', () => {
      const state = new storeClass.Value({ events: [] }, adapter).state;

      it('returns daily, weekly, monthly and yearly presets', () => {
        const startPlainDate = PlainDate.from('2025-08-05'); // Tuesday
        const presets = schedulerRecurringEventSelectors.presets(state, startPlainDate)!;

        expect(presets.DAILY).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
        expect(presets.WEEKLY).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['TU'],
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
      const startPlainDate = PlainDate.from('2025-08-05'); // Tuesday
      const presets = schedulerRecurringEventSelectors.presets(state, startPlainDate)!;

      it('returns null when rule undefined', () => {
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, undefined, startPlainDate),
        ).to.equal(null);
      });

      it('detects daily, weekly, monthly and yearly presets', () => {
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.DAILY, startPlainDate),
        ).to.equal('DAILY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.WEEKLY, startPlainDate),
        ).to.equal('WEEKLY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.MONTHLY, startPlainDate),
        ).to.equal('MONTHLY');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.YEARLY, startPlainDate),
        ).to.equal('YEARLY');
      });

      it('classifies daily interval>1 or with finite end (count) as custom', () => {
        const ruleInterval2: SchedulerProcessedEventRecurrenceRule = {
          ...presets.DAILY,
          interval: 2,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, startPlainDate),
        ).to.equal('custom');

        const ruleFiniteCount: SchedulerProcessedEventRecurrenceRule = {
          ...presets.DAILY,
          count: 5,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleFiniteCount, startPlainDate),
        ).to.equal('custom');
      });

      it('classifies weekly with extra day as custom', () => {
        const rule: SchedulerProcessedEventRecurrenceRule = {
          ...presets.WEEKLY,
          byDay: ['TU', 'WE'],
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, rule, startPlainDate),
        ).to.equal('custom');
      });

      it('classifies monthly with different day or with interval>1 as custom', () => {
        const ruleDifferentDay: SchedulerProcessedEventRecurrenceRule = {
          ...presets.MONTHLY,
          byMonthDay: [26],
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(
            state,
            ruleDifferentDay,
            startPlainDate,
          ),
        ).to.equal('custom');

        const ruleInterval2: SchedulerProcessedEventRecurrenceRule = {
          ...presets.MONTHLY,
          interval: 2,
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, startPlainDate),
        ).to.equal('custom');
      });

      it('classifies yearly interval>1 as custom', () => {
        const rule: SchedulerProcessedEventRecurrenceRule = { ...presets.YEARLY, interval: 2 };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, rule, startPlainDate),
        ).to.equal('custom');
      });
    });
  },
);
