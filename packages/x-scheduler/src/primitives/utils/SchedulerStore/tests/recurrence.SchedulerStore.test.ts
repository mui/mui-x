import { adapter } from 'test/utils/scheduler';
import { RRuleSpec } from '@mui/x-scheduler/primitives/models';
import { storeClasses } from './utils';
import { getByDayMaps } from '../../recurrence-utils';

const DEFAULT_PARAMS = { events: [] };

storeClasses.forEach((storeClass) => {
  describe(`Date - ${storeClass.name}`, () => {
    describe('Method: buildRecurrencePresets', () => {
      it('returns daily, weekly, monthly and yearly presets', () => {
        const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
        const start = adapter.date('2025-08-05T09:00:00Z'); // Tuesday
        const presets = store.buildRecurrencePresets(start);
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

    describe('Method: getRecurrencePresetKeyFromRule', () => {
      const store = new storeClass.Value({ ...DEFAULT_PARAMS }, adapter);
      const start = adapter.date('2025-08-05T09:00:00'); // Tuesday
      const presets = store.buildRecurrencePresets(start);

      it('returns null when rule undefined', () => {
        expect(store.getRecurrencePresetKeyFromRule(undefined, start)).to.equal(null);
      });

      it('detects daily, weekly, monthly and yearly presets', () => {
        expect(store.getRecurrencePresetKeyFromRule(presets.daily, start)).to.equal('daily');
        expect(store.getRecurrencePresetKeyFromRule(presets.weekly, start)).to.equal('weekly');
        expect(store.getRecurrencePresetKeyFromRule(presets.monthly, start)).to.equal('monthly');
        expect(store.getRecurrencePresetKeyFromRule(presets.yearly, start)).to.equal('yearly');
      });

      it('classifies daily interval>1 or with finite end (count) as custom', () => {
        const ruleInterval2: RRuleSpec = { ...presets.daily, interval: 2 };
        expect(store.getRecurrencePresetKeyFromRule(ruleInterval2, start)).to.equal('custom');

        const ruleFiniteCount: RRuleSpec = { ...presets.daily, count: 5 };
        expect(store.getRecurrencePresetKeyFromRule(ruleFiniteCount, start)).to.equal('custom');
      });

      it('classifies weekly with extra day as custom', () => {
        const rule: RRuleSpec = { ...presets.weekly, byDay: ['TU', 'WE'] };
        expect(store.getRecurrencePresetKeyFromRule(rule, start)).to.equal('custom');
      });

      it('classifies monthly with different day or with interval>1 as custom', () => {
        const ruleDifferentDay: RRuleSpec = { ...presets.monthly, byMonthDay: [26] };
        expect(store.getRecurrencePresetKeyFromRule(ruleDifferentDay, start)).to.equal('custom');

        const ruleInterval2: RRuleSpec = { ...presets.monthly, interval: 2 };
        expect(store.getRecurrencePresetKeyFromRule(ruleInterval2, start)).to.equal('custom');
      });

      it('classifies yearly interval>1 as custom', () => {
        const rule: RRuleSpec = { ...presets.yearly, interval: 2 };
        expect(store.getRecurrencePresetKeyFromRule(rule, start)).to.equal('custom');
      });
    });
  });
});
