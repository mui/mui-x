import { DateTime } from 'luxon';
import { RecurrenceRule } from '@mui/x-scheduler/primitives/models';
import { detectRecurrenceKeyFromRule, buildRecurrencePresets } from './recurrence-utils';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';

describe('recurrence-utils', () => {
  const adapter = getAdapter();
  const start = DateTime.fromISO('2025-08-05T09:00:00'); // Tuesday

  describe('buildRecurrencePresets', () => {
    it('returns daily, weekly, monthly and yearly presets', () => {
      const presets = buildRecurrencePresets(adapter, start);

      expect(presets.daily).to.deep.equal({
        frequency: 'daily',
        interval: 1,
        end: { type: 'never' },
      });
      expect(presets.weekly).to.deep.equal({
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [2],
        end: { type: 'never' },
      });
      expect(presets.monthly).to.deep.equal({
        frequency: 'monthly',
        interval: 1,
        monthly: { mode: 'onDate', day: 5 },
        end: { type: 'never' },
      });
      expect(presets.yearly).to.deep.equal({
        frequency: 'yearly',
        interval: 1,
        end: { type: 'never' },
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

    it('classifies daily interval>1 or with finite end as custom', () => {
      const ruleInterval2: RecurrenceRule = { ...presets.daily, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, ruleInterval2, start)).to.equal('custom');

      const ruleFiniteEnd: RecurrenceRule = {
        ...presets.daily,
        end: { type: 'after', count: 5 },
      };
      expect(detectRecurrenceKeyFromRule(adapter, ruleFiniteEnd, start)).to.equal('custom');
    });

    it('classifies weekly with extra day as custom', () => {
      const rule: RecurrenceRule = { ...presets.weekly, daysOfWeek: [2, 3] };
      expect(detectRecurrenceKeyFromRule(adapter, rule, start)).to.equal('custom');
    });

    it('classifies monthly with different day or with interval>1 as custom', () => {
      const ruleDifferentDay: RecurrenceRule = {
        ...presets.monthly,
        monthly: { mode: 'onDate', day: 26 },
      };
      expect(detectRecurrenceKeyFromRule(adapter, ruleDifferentDay, start)).to.equal('custom');

      const ruleInterval2: RecurrenceRule = { ...presets.monthly, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, ruleInterval2, start)).to.equal('custom');
    });

    it('classifies yearly interval>1 as custom', () => {
      const rule: RecurrenceRule = { ...presets.yearly, interval: 2 };
      expect(detectRecurrenceKeyFromRule(adapter, rule, start)).to.equal('custom');
    });
  });
});
