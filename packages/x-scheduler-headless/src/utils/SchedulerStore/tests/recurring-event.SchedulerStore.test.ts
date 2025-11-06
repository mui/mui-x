import { adapter } from 'test/utils/scheduler';
import { RecurringEventRecurrenceRule } from '@mui/x-scheduler-headless/models';
import { storeClasses } from './utils';
import { getWeekDayCode } from '../../recurring-event-utils';
import { schedulerRecurringEventSelectors } from '../../../scheduler-selectors';
import { SchedulerState as State } from '../SchedulerStore.types';

const baseState = (overrides: Partial<State> = {}) =>
  ({
    adapter,
    ...overrides,
  }) as State;

storeClasses.forEach((storeClass) => {
  describe(`Recurring event - ${storeClass.name}`, () => {
    describe('Selector: recurrencePresets', () => {
      it('returns daily, weekly, monthly and yearly presets', () => {
        const state = baseState();
        const start = adapter.date('2025-08-05T09:00:00Z'); // Tuesday
        const presets = schedulerRecurringEventSelectors.presets(state, start);

        expect(presets.daily).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
        expect(presets.weekly).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: [getWeekDayCode(adapter, start)],
        });
        expect(presets.monthly).to.deep.equal({
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [5],
        });
        expect(presets.yearly).to.deep.equal({
          freq: 'YEARLY',
          interval: 1,
        });
      });
    });

    describe('Selector: defaultRecurrencePresetKey', () => {
      const state = baseState();
      const start = adapter.date('2025-08-05T09:00:00'); // Tuesday
      const presets = schedulerRecurringEventSelectors.presets(state, start);

      it('returns null when rule undefined', () => {
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, undefined, start)).to.equal(
          null,
        );
      });

      it('detects daily, weekly, monthly and yearly presets', () => {
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.daily, start),
        ).to.equal('daily');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.weekly, start),
        ).to.equal('weekly');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.monthly, start),
        ).to.equal('monthly');
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, presets.yearly, start),
        ).to.equal('yearly');
      });

      it('classifies daily interval>1 or with finite end (count) as custom', () => {
        const ruleInterval2: RecurringEventRecurrenceRule = { ...presets.daily, interval: 2 };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, start),
        ).to.equal('custom');

        const ruleFiniteCount: RecurringEventRecurrenceRule = { ...presets.daily, count: 5 };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleFiniteCount, start),
        ).to.equal('custom');
      });

      it('classifies weekly with extra day as custom', () => {
        const rule: RecurringEventRecurrenceRule = { ...presets.weekly, byDay: ['TU', 'WE'] };
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
          'custom',
        );
      });

      it('classifies monthly with different day or with interval>1 as custom', () => {
        const ruleDifferentDay: RecurringEventRecurrenceRule = {
          ...presets.monthly,
          byMonthDay: [26],
        };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleDifferentDay, start),
        ).to.equal('custom');

        const ruleInterval2: RecurringEventRecurrenceRule = { ...presets.monthly, interval: 2 };
        expect(
          schedulerRecurringEventSelectors.defaultPresetKey(state, ruleInterval2, start),
        ).to.equal('custom');
      });

      it('classifies yearly interval>1 as custom', () => {
        const rule: RecurringEventRecurrenceRule = { ...presets.yearly, interval: 2 };
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
          'custom',
        );
      });
    });
  });
});
