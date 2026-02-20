import { adapter } from 'test/utils/scheduler';
import {
  RecurringEventByDayValue,
  SchedulerEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import { parseRRule, serializeRRule } from './rRuleString';

describe('recurring-events/rRuleString', () => {
  describe('parseRRuleString', () => {
    it('should return the same object if the input is already an object without until', () => {
      const input: SchedulerEventRecurrenceRule = { freq: 'DAILY', interval: 2 };
      const result = parseRRule(adapter, input, 'default');
      expect(result).to.deep.equal(input);
    });

    it('should resolve string until from object input', () => {
      const result = parseRRule(
        adapter,
        { freq: 'DAILY', until: '2025-03-15T00:00:00Z' },
        'default',
      );
      expect(result.freq).to.equal('DAILY');
      expect(typeof result.until).to.equal('object');
      expect(result.until!).toEqualDateTime('2025-03-15T00:00:00.000Z');
    });

    it('should parse a simple RRULE string into an object', () => {
      const result = parseRRule(adapter, 'FREQ=DAILY;INTERVAL=2;COUNT=5', 'default');
      expect(result).to.deep.equal({
        freq: 'DAILY',
        interval: 2,
        count: 5,
      });
    });

    it('should parse BYDAY correctly', () => {
      const result = parseRRule(adapter, 'FREQ=WEEKLY;BYDAY=MO,WE,FR', 'default');
      expect(result).to.deep.equal({
        freq: 'WEEKLY',
        byDay: ['MO', 'WE', 'FR'],
      });

      const resultWithOrdinals = parseRRule(adapter, 'FREQ=MONTHLY;BYDAY=-1FR', 'default');
      expect(resultWithOrdinals).to.deep.equal({
        freq: 'MONTHLY',
        byDay: ['-1FR'],
      });
    });

    it('should parse BYMONTHDAY correctly', () => {
      const result = parseRRule(adapter, 'FREQ=WEEKLY;BYMONTHDAY=15, 28', 'default');
      expect(result).to.deep.equal({
        freq: 'WEEKLY',
        byMonthDay: [15, 28],
      });
    });

    it('should parse BYMONTH correctly', () => {
      const result = parseRRule(adapter, 'FREQ=YEARLY;BYMONTH=1,6,12', 'default');
      expect(result).to.deep.equal({
        freq: 'YEARLY',
        byMonth: [1, 6, 12],
      });
    });

    it('should parse UNTIL correctly', () => {
      const result = parseRRule(adapter, 'FREQ=DAILY;UNTIL=20250315T000000Z', 'default');
      expect(adapter.isValid(result.until!)).to.equal(true);
    });

    it('should sort BYDAY values in standard order regardless of input order', () => {
      const result = parseRRule(adapter, 'FREQ=WEEKLY;BYDAY=FR,MO,WE', 'default');
      expect(result.byDay).to.deep.equal(['MO', 'WE', 'FR']);
    });

    it('should sort BYDAY with ordinals correctly', () => {
      const result = parseRRule(adapter, 'FREQ=MONTHLY;BYDAY=2TU,-1FR,1MO', 'default');
      expect(result.byDay).to.deep.equal(['1MO', '2TU', '-1FR']);
    });

    it('should sort BYMONTHDAY numerically', () => {
      const result = parseRRule(adapter, 'FREQ=MONTHLY;BYMONTHDAY=28,5,15', 'default');
      expect(result.byMonthDay).to.deep.equal([5, 15, 28]);
    });

    it('should sort BYMONTH numerically', () => {
      const result = parseRRule(adapter, 'FREQ=YEARLY;BYMONTH=12,1,6', 'default');
      expect(result.byMonth).to.deep.equal([1, 6, 12]);
    });

    it('should throw when the input is empty', () => {
      expect(() => parseRRule(adapter, '', 'default')).to.throw(
        'MUI: RRULE must include a FREQ property.',
      );
    });

    it('should throw when the key or the value are empty', () => {
      expect(() => parseRRule(adapter, 'FREQ=DAILY;=2', 'default')).to.throw(
        'MUI: Invalid RRULE part: "=2"',
      );
      expect(() => parseRRule(adapter, 'FREQ=DAILY;INTERVAL=', 'default')).to.throw(
        'MUI: Invalid RRULE part: "INTERVAL="',
      );
    });

    it('should throw when UNTIL is invalid', () => {
      expect(() => parseRRule(adapter, 'FREQ=DAILY;UNTIL=not-a-date', 'default')).to.throw(
        'MUI: Invalid UNTIL date: "NOT-A-DATE"',
      );
    });

    it('should throw when FREQ is missing', () => {
      expect(() => parseRRule(adapter, 'INTERVAL=2', 'default')).to.throw(
        'MUI: RRULE must include a FREQ property.',
      );
    });

    it('should throw when the RRULE contains unsupported properties', () => {
      expect(() => parseRRule(adapter, 'FREQ=DAILY;FOO=bar', 'default')).to.throw(
        'MUI: Unsupported RRULE property: "FOO"',
      );
    });

    it('should throw for invalid INTERVAL value', () => {
      expect(() => parseRRule(adapter, 'FREQ=DAILY;INTERVAL=zero', 'default')).to.throw(
        'MUI: Invalid INTERVAL value: "ZERO"',
      );
    });

    it('should throw for invalid BYMONTHDAY values', () => {
      expect(() => parseRRule(adapter, 'FREQ=MONTHLY;BYMONTHDAY=0,50', 'default')).to.throw(
        'MUI: Invalid BYMONTHDAY values: "0,50"',
      );
    });

    it('should throw for invalid BYMONTH values', () => {
      expect(() => parseRRule(adapter, 'FREQ=YEARLY;BYMONTH=0,13', 'default')).to.throw(
        'MUI: Invalid BYMONTH values: "0,13"',
      );
    });

    it('should throw for invalid COUNT value', () => {
      expect(() => parseRRule(adapter, 'FREQ=DAILY;COUNT=-2', 'default')).to.throw(
        'MUI: Invalid COUNT value: "-2"',
      );
    });

    it('should trim whitespace and handle lowercase properties', () => {
      const result = parseRRule(
        adapter,
        '  freq=weekly ; byday= mo, tu  ; interval= 3 ',
        'default',
      );
      expect(result).to.deep.equal({
        freq: 'WEEKLY',
        byDay: ['MO', 'TU'],
        interval: 3,
      });
    });
  });

  describe('serializeRRule', () => {
    it('should serialize a simple DAILY rule', () => {
      const rule = { freq: 'DAILY' as const };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=DAILY');
    });

    it('should include INTERVAL only when different from 1', () => {
      const ruleWithInterval1 = { freq: 'DAILY' as const, interval: 1 };
      const resultWithoutInterval = serializeRRule(adapter, ruleWithInterval1);
      expect(resultWithoutInterval).to.equal('FREQ=DAILY');

      const ruleWithInterval2 = { freq: 'DAILY' as const, interval: 2 };
      const resultWithInterval = serializeRRule(adapter, ruleWithInterval2);
      expect(resultWithInterval).to.equal('FREQ=DAILY;INTERVAL=2');
    });

    it('should serialize BYDAY correctly', () => {
      const rule = {
        freq: 'WEEKLY' as const,
        byDay: ['MO', 'WE', 'FR'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });

    it('should serialize BYMONTHDAY correctly', () => {
      const rule = { freq: 'MONTHLY' as const, byMonthDay: [5, 15, 28] };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=MONTHLY;BYMONTHDAY=5,15,28');
    });

    it('should serialize BYMONTH correctly', () => {
      const rule = { freq: 'YEARLY' as const, byMonth: [1, 6, 12] };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=YEARLY;BYMONTH=1,6,12');
    });

    it('should serialize COUNT correctly', () => {
      const rule = { freq: 'DAILY' as const, count: 5 };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=DAILY;COUNT=5');
    });

    it('should serialize UNTIL in RFC5545 UTC format', () => {
      const until = adapter.date('2025-03-15T00:00:00', 'default');
      const rule = { freq: 'DAILY' as const, until };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=DAILY;UNTIL=20250315T000000Z', 'default');
    });

    it('should combine multiple properties correctly', () => {
      const until = adapter.date('2025-03-15T00:00:00Z', 'default');
      const rule = {
        freq: 'WEEKLY' as const,
        interval: 2,
        byDay: ['MO', 'FR'] as RecurringEventByDayValue[],
        until,
      };

      const result = serializeRRule(adapter, rule);
      expect(result).to.equal(
        'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;UNTIL=20250315T000000Z',
        'default',
      );
    });

    it('should handle empty BYDAY, BYMONTHDAY AND BYMONTHgracefully', () => {
      const ruleWithEmptyByDay = { freq: 'WEEKLY' as const, byDay: [] };
      const resultWithoutByDay = serializeRRule(adapter, ruleWithEmptyByDay);
      expect(resultWithoutByDay).to.equal('FREQ=WEEKLY');

      const ruleWithEmptyByMonthDay = { freq: 'MONTHLY' as const, byMonthDay: [] };
      const resultWithoutByMonthDay = serializeRRule(adapter, ruleWithEmptyByMonthDay);
      expect(resultWithoutByMonthDay).to.equal('FREQ=MONTHLY');

      const ruleWithEmptyByMonth = { freq: 'YEARLY' as const, byMonth: [] };
      const resultWithoutByMonth = serializeRRule(adapter, ruleWithEmptyByMonth);
      expect(resultWithoutByMonth).to.equal('FREQ=YEARLY');
    });

    it('should serialize BYDAY values in correct order regardless of input order', () => {
      const rule = {
        freq: 'WEEKLY' as const,
        byDay: ['FR', 'MO', 'WE'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });

    it('should serialize BYDAY with ordinals in correct order', () => {
      const rule = {
        freq: 'MONTHLY' as const,
        byDay: ['2TU', '-1FR', '1MO'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=MONTHLY;BYDAY=1MO,2TU,-1FR');
    });

    it('should serialize BYMONTHDAY and BYMONTH sorted numerically', () => {
      const rule = { freq: 'YEARLY' as const, byMonthDay: [28, 5, 15], byMonth: [12, 1, 6] };
      const result = serializeRRule(adapter, rule);
      expect(result).to.equal('FREQ=YEARLY;BYMONTHDAY=5,15,28;BYMONTH=1,6,12');
    });

    it('should normalize equivalent RRULE strings with different BYDAY order', () => {
      const inputA = 'FREQ=WEEKLY;BYDAY=MO,WE,FR';
      const inputB = 'FREQ=WEEKLY;BYDAY=FR,MO,WE';
      const parsedA = parseRRule(adapter, inputA, 'default');
      const parsedB = parseRRule(adapter, inputB, 'default');
      expect(serializeRRule(adapter, parsedA)).to.equal(serializeRRule(adapter, parsedB));
    });

    it('should round-trip correctly (parseRRuleString - serializeRRule)', () => {
      const input = 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;UNTIL=20250315T000000Z';
      const parsed = parseRRule(adapter, input, 'default');
      const serialized = serializeRRule(adapter, parsed);
      expect(serialized).to.equal(input);
    });

    it('should round-trip even if BYDAY order differs in input', () => {
      const input = 'FREQ=WEEKLY;BYDAY=FR,MO,WE';
      const parsed = parseRRule(adapter, input, 'default');
      const serialized = serializeRRule(adapter, parsed);
      expect(serialized).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });
  });
});
