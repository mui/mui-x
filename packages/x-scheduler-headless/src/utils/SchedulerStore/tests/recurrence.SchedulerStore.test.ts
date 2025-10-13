import { adapter } from 'test/utils/scheduler';
import { RRuleSpec } from '@mui/x-scheduler-headless/models';
import { storeClasses } from './utils';
import { getByDayMaps } from '../../recurrence-utils';
import { selectors } from '../SchedulerStore.selectors';
import { SchedulerState as State } from '../SchedulerStore.types';

const baseState = (overrides: Partial<State> = {}) =>
  ({
    adapter,
    ...overrides,
  }) as State;

storeClasses.forEach((storeClass) => {
  describe(`Recurrence - ${storeClass.name}`, () => {
    describe('Selector: recurrencePresets', () => {
      it('returns daily, weekly, monthly and yearly presets', () => {
        const state = baseState();
        const start = adapter.date('2025-08-05T09:00:00Z'); // Tuesday
        const presets = selectors.recurrencePresets(state, start);
        const { numToByDay } = getByDayMaps(adapter);

        expect(presets.daily).to.deep.equal({
          freq: 'DAILY',
          interval: 1,
        });
        expect(presets.weekly).to.deep.equal({
          freq: 'WEEKLY',
          interval: 1,
          byDay: [numToByDay[adapter.getDayOfWeek(start)]],
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
      const presets = selectors.recurrencePresets(state, start);

      it('returns null when rule undefined', () => {
        expect(selectors.defaultRecurrencePresetKey(state, undefined, start)).to.equal(null);
      });

      it('detects daily, weekly, monthly and yearly presets', () => {
        expect(selectors.defaultRecurrencePresetKey(state, presets.daily, start)).to.equal('daily');
        expect(selectors.defaultRecurrencePresetKey(state, presets.weekly, start)).to.equal(
          'weekly',
        );
        expect(selectors.defaultRecurrencePresetKey(state, presets.monthly, start)).to.equal(
          'monthly',
        );
        expect(selectors.defaultRecurrencePresetKey(state, presets.yearly, start)).to.equal(
          'yearly',
        );
      });

      it('classifies daily interval>1 or with finite end (count) as custom', () => {
        const ruleInterval2: RRuleSpec = { ...presets.daily, interval: 2 };
        expect(selectors.defaultRecurrencePresetKey(state, ruleInterval2, start)).to.equal(
          'custom',
        );

        const ruleFiniteCount: RRuleSpec = { ...presets.daily, count: 5 };
        expect(selectors.defaultRecurrencePresetKey(state, ruleFiniteCount, start)).to.equal(
          'custom',
        );
      });

      it('classifies weekly with extra day as custom', () => {
        const rule: RRuleSpec = { ...presets.weekly, byDay: ['TU', 'WE'] };
        expect(selectors.defaultRecurrencePresetKey(state, rule, start)).to.equal('custom');
      });

      it('classifies monthly with different day or with interval>1 as custom', () => {
        const ruleDifferentDay: RRuleSpec = { ...presets.monthly, byMonthDay: [26] };
        expect(selectors.defaultRecurrencePresetKey(state, ruleDifferentDay, start)).to.equal(
          'custom',
        );

        const ruleInterval2: RRuleSpec = { ...presets.monthly, interval: 2 };
        expect(selectors.defaultRecurrencePresetKey(state, ruleInterval2, start)).to.equal(
          'custom',
        );
      });

      it('classifies yearly interval>1 as custom', () => {
        const rule: RRuleSpec = { ...presets.yearly, interval: 2 };
        expect(selectors.defaultRecurrencePresetKey(state, rule, start)).to.equal('custom');
      });
    });
  });
});
