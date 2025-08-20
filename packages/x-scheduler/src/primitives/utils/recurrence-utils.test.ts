import { DateTime } from 'luxon';
import { RRuleSpec } from '@mui/x-scheduler/primitives/models';
import { detectRecurrenceKeyFromRule, buildRecurrencePresets } from './recurrence-utils';
import { getAdapter } from './adapter/getAdapter';

describe('recurrence-utils', () => {
  const adapter = getAdapter();
  const start = DateTime.fromISO('2025-08-05T09:00:00'); // Tuesday

  describe('buildRecurrencePresets', () => {
    it('returns daily, weekly, monthly and yearly presets', () => {
      const presets = buildRecurrencePresets(adapter, start);

      expect(presets.daily).to.deep.equal({
        freq: 'DAILY',
        interval: 1,
      });
      expect(presets.weekly).to.deep.equal({
        freq: 'WEEKLY',
        interval: 1,
        byDay: ['TU'],
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

  describe('detectRecurrenceKeyFromRule', () => {
    const presets = buildRecurrencePresets(adapter, start);

    it('returns null when rule undefined', () => {
      expect(detectRecurrenceKeyFromRule(adapter, undefined, start)).to.equal(null);
    });

    it('detects daily, weekly, monthly and yearly presets', () => {
      expect(detectRecurrenceKeyFromRule(adapter, presets.daily, start)).to.equal('daily');
      expect(detectRecurrenceKeyFromRule(adapter, presets.weekly, start)).to.equal('weekly');
      expect(detectRecurrenceKeyFromRule(adapter, presets.monthly, start)).to.equal('monthly');
      expect(detectRecurrenceKeyFromRule(adapter, presets.yearly, start)).to.equal('yearly');
    });

    it('classifies daily interval>1 or with finite end (count) as custom', () => {
      const ruleInterval2: RRuleSpec = { ...presets.daily, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, ruleInterval2, start)).to.equal('custom');

      const ruleFiniteCount: RRuleSpec = { ...presets.daily, count: 5 };
      expect(detectRecurrenceKeyFromRule(adapter, ruleFiniteCount, start)).to.equal('custom');
    });

    it('classifies weekly with extra day as custom', () => {
      const rule: RRuleSpec = { ...presets.weekly, byDay: ['TU', 'WE'] };
      expect(detectRecurrenceKeyFromRule(adapter, rule, start)).to.equal('custom');
    });

    it('classifies monthly with different day or with interval>1 as custom', () => {
      const ruleDifferentDay: RRuleSpec = { ...presets.monthly, byMonthDay: [26] };
      expect(detectRecurrenceKeyFromRule(adapter, ruleDifferentDay, start)).to.equal('custom');

      const ruleInterval2: RRuleSpec = { ...presets.monthly, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, ruleInterval2, start)).to.equal('custom');
    });

    it('classifies yearly interval>1 as custom', () => {
      const rule: RRuleSpec = { ...presets.yearly, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, rule, start)).to.equal('custom');
    });
  });
});
