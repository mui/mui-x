import type {
  RecurringEventByDayValue,
  SchedulerEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BaseTemporal, toEpochMs } from '@mui/x-scheduler-internals/internals';
import { isSameRRule, parseRRule, serializeRRule } from './rRuleString';
import { RecurringSeries } from './RecurringSeries';

describe('recurring-events/rRuleString', () => {
  describe('parseRRuleString', () => {
    it('should return the same object if the input is already an object without until', () => {
      const input: SchedulerEventRecurrenceRule = { freq: 'DAILY', interval: 2 };
      const result = parseRRule(input, 'default');
      expect(result).to.deep.equal(input);
    });

    it('should resolve string until from object input', () => {
      const result = parseRRule({ freq: 'DAILY', until: '2025-03-15T00:00:00Z' }, 'UTC', true);
      expect(result.freq).to.equal('DAILY');
      expect(result.until).toEqualPlainDate('2025-03-15');
    });

    it('should parse a simple RRULE string into an object', () => {
      const result = parseRRule('FREQ=DAILY;INTERVAL=2;COUNT=5', 'default');
      expect(result).to.deep.equal({
        freq: 'DAILY',
        interval: 2,
        count: 5,
      });
    });

    it('should parse BYDAY correctly', () => {
      const result = parseRRule('FREQ=WEEKLY;BYDAY=MO,WE,FR', 'default');
      expect(result).to.deep.equal({
        freq: 'WEEKLY',
        byDay: ['MO', 'WE', 'FR'],
      });

      const resultWithOrdinals = parseRRule('FREQ=MONTHLY;BYDAY=-1FR', 'default');
      expect(resultWithOrdinals).to.deep.equal({
        freq: 'MONTHLY',
        byDay: ['-1FR'],
      });
    });

    it('should parse BYMONTHDAY correctly', () => {
      const result = parseRRule('FREQ=WEEKLY;BYMONTHDAY=15, 28', 'default');
      expect(result).to.deep.equal({
        freq: 'WEEKLY',
        byMonthDay: [15, 28],
      });
    });

    it('should read a UNTIL ending in Z as a UTC instant, like the object input', () => {
      const fromString = parseRRule('FREQ=DAILY;UNTIL=20250315T000000Z', 'America/New_York', true);
      const fromObject = parseRRule(
        { freq: 'DAILY', until: '2025-03-15T00:00:00Z' },
        'America/New_York',
        true,
      );

      // The day of the instant in the timezone of the event.
      expect(fromString.until).toEqualPlainDate('2025-03-14');
      expect(fromObject.until).toEqualPlainDate('2025-03-14');
    });

    it.each([
      // 02:30 CEST, before the 02:45 CEST occurrence of October 26th.
      ['20251026T003000Z', ['2025-10-25']],
      // 02:30 CET, after it.
      ['20251026T013000Z', ['2025-10-25', '2025-10-26']],
    ])('should keep the instant of UNTIL=%s in the hour Paris repeats', (until, expected) => {
      // Europe/Paris falls back from 03:00 CEST to 02:00 CET on October 26th, 2025.
      const rule = parseRRule(`FREQ=DAILY;UNTIL=${until}`, 'Europe/Paris');
      const series = new RecurringSeries({
        rule: { ...rule },
        start: toEpochMs(BaseTemporal.PlainDateTime.from('2025-10-25T02:45'), 'Europe/Paris'),
        timezone: 'Europe/Paris',
      });

      expect(rule.until!.toString()).to.equal('2025-10-26T02:30:00');
      expect(
        series
          .getOccurrenceDays(
            BaseTemporal.PlainDate.from('2025-10-24'),
            BaseTemporal.PlainDate.from('2025-10-28'),
          )
          .map((day) => day.toString()),
      ).to.deep.equal(expected);
      expect(serializeRRule({ ...rule }, 'Europe/Paris')).to.equal(`FREQ=DAILY;UNTIL=${until}`);
    });

    it.each([
      {
        timezone: 'Europe/Paris',
        firstInstant: '2025-10-26T00:30:00Z',
        secondInstant: '2025-10-26T01:30:00Z',
        pickedTime: '2025-10-26T02:30',
        matchesFirst: true,
      },
      {
        timezone: 'America/Santiago',
        firstInstant: '2024-04-07T02:59:59.999Z',
        secondInstant: '2024-04-07T03:59:59.999Z',
        pickedTime: '2024-04-06T23:59:59.999',
        matchesFirst: false,
      },
    ])(
      'should compare repeated-hour cutoffs consistently with saving in $timezone',
      ({ timezone, firstInstant, secondInstant, pickedTime, matchesFirst }) => {
        const parse = (until: string) => parseRRule({ freq: 'DAILY', until }, timezone, false);
        const first = parse(firstInstant);
        const second = parse(secondInstant);

        expect(isSameRRule(first, second)).to.equal(false);
        expect(isSameRRule(second, { ...second })).to.equal(true);
        // New wall-clock values use the first instance; selecting the end of a day uses its last instant.
        const picked = BaseTemporal.PlainDateTime.from(pickedTime);
        expect(isSameRRule(first, { ...first, until: picked })).to.equal(matchesFirst);
        expect(isSameRRule(second, { ...second, until: picked })).to.equal(!matchesFirst);
      },
    );

    it('should read a UNTIL date as that day', () => {
      const result = parseRRule('FREQ=DAILY;UNTIL=20250315', 'America/New_York', true);
      expect(result.until).toEqualPlainDate('2025-03-15');
    });

    describe('with a host timezone that observes daylight saving time', () => {
      afterEach(() => {
        vi.unstubAllEnvs();
      });

      // `TZ` only changes the host timezone under Node.
      it.skipIf(!isJSDOM)(
        'should not let the host timezone shift a UNTIL in its daylight saving gap',
        () => {
          // 02:30 on March 9th 2025 does not exist in New York (clocks jump from 02:00 to 03:00).
          vi.stubEnv('TZ', 'America/New_York');

          const fromString = parseRRule(
            'FREQ=DAILY;UNTIL=20250309T023000Z',
            'America/Sao_Paulo',
            true,
          );
          const fromObject = parseRRule(
            { freq: 'DAILY', until: '2025-03-09T02:30:00Z' },
            'America/Sao_Paulo',
            true,
          );

          expect(fromString.until).toEqualPlainDate('2025-03-08');
          expect(fromObject.until).toEqualPlainDate('2025-03-08');
        },
      );
    });

    it('should sort BYDAY values in standard order regardless of input order', () => {
      const result = parseRRule('FREQ=WEEKLY;BYDAY=FR,MO,WE', 'default');
      expect(result.byDay).to.deep.equal(['MO', 'WE', 'FR']);
    });

    it('should sort BYMONTHDAY numerically', () => {
      const result = parseRRule('FREQ=MONTHLY;BYMONTHDAY=28,5,15', 'default');
      expect(result.byMonthDay).to.deep.equal([5, 15, 28]);
    });

    it('should throw when the input is empty', () => {
      expect(() => parseRRule('', 'default')).to.throw(
        'MUI X Scheduler: RRULE must include a FREQ property. The frequency (DAILY, WEEKLY, MONTHLY, or YEARLY) is required for recurrence rules. Add a FREQ property to the RRULE string.',
      );
    });

    it('should throw when the key or the value are empty', () => {
      expect(() => parseRRule('FREQ=DAILY;=2', 'default')).to.throw(
        'MUI X Scheduler: Invalid RRULE part "=2". Each RRULE part must be in the format "KEY=VALUE". Check the recurrence rule string format.',
      );
      expect(() => parseRRule('FREQ=DAILY;INTERVAL=', 'default')).to.throw(
        'MUI X Scheduler: Invalid RRULE part "INTERVAL=". Each RRULE part must be in the format "KEY=VALUE". Check the recurrence rule string format.',
      );
    });

    it('should throw when UNTIL is invalid', () => {
      expect(() => parseRRule('FREQ=DAILY;UNTIL=not-a-date', 'default')).to.throw(
        'MUI X Scheduler: Invalid UNTIL date "NOT-A-DATE". The recurrence rule cannot tell when the series ends. Use a date like 20250315 or a UTC date-time like 20250315T093000Z.',
      );
    });

    it('should read a UNTIL in a year below 100 as that year', () => {
      const result = parseRRule('FREQ=DAILY;UNTIL=00990315T000000Z', 'UTC');
      expect(result.until!.year).to.equal(99);
    });

    it('should throw when UNTIL is a date that does not exist', () => {
      for (const until of [
        '20250231T000000Z',
        '20251301T000000Z',
        '20250001T000000Z',
        '20250100T000000Z',
        '20250101T240000Z',
        '20250101T006000Z',
        '20250231',
        '2025031',
      ]) {
        expect(() => parseRRule(`FREQ=DAILY;UNTIL=${until}`, 'default')).to.throw(
          `MUI X Scheduler: Invalid UNTIL date "${until}".`,
        );
      }
    });

    it('should throw when FREQ is missing', () => {
      expect(() => parseRRule('INTERVAL=2', 'default')).to.throw(
        'MUI X Scheduler: RRULE must include a FREQ property. The frequency (DAILY, WEEKLY, MONTHLY, or YEARLY) is required for recurrence rules. Add a FREQ property to the RRULE string.',
      );
    });

    it('should throw when FREQ has an unsupported value', () => {
      expect(() => parseRRule('FREQ=HOURLY', 'default')).to.throw(
        'MUI X Scheduler: Invalid FREQ value "HOURLY". The frequency must be one of DAILY, WEEKLY, MONTHLY, or YEARLY. Provide a supported frequency value.',
      );
    });

    it('should throw when the object input has an unsupported freq value', () => {
      expect(() =>
        parseRRule({ freq: 'HOURLY' as SchedulerEventRecurrenceRule['freq'] }, 'default'),
      ).to.throw(
        'MUI X Scheduler: Invalid FREQ value "HOURLY". The frequency must be one of DAILY, WEEKLY, MONTHLY, or YEARLY. Provide a supported frequency value.',
      );
    });

    it('should reject a non-canonical object freq instead of normalizing it', () => {
      expect(() =>
        parseRRule({ freq: 'daily' as SchedulerEventRecurrenceRule['freq'] }, 'default'),
      ).to.throw(
        'MUI X Scheduler: Invalid FREQ value "daily". The frequency must be one of DAILY, WEEKLY, MONTHLY, or YEARLY. Provide a supported frequency value.',
      );
    });

    it('should throw a dedicated message when the object input has no freq value', () => {
      expect(() => parseRRule({} as SchedulerEventRecurrenceRule, 'default')).to.throw(
        'MUI X Scheduler: The recurrence rule must include a FREQ value. The frequency (DAILY, WEEKLY, MONTHLY, or YEARLY) is required for recurrence rules. Provide a freq value.',
      );
    });

    it('should throw when the object freq matches a prototype key', () => {
      expect(() =>
        parseRRule({ freq: 'toString' as SchedulerEventRecurrenceRule['freq'] }, 'default'),
      ).to.throw(
        'MUI X Scheduler: Invalid FREQ value "toString". The frequency must be one of DAILY, WEEKLY, MONTHLY, or YEARLY. Provide a supported frequency value.',
      );
    });

    it('should throw when the RRULE contains unsupported properties', () => {
      expect(() => parseRRule('FREQ=DAILY;FOO=bar', 'default')).to.throw(
        'MUI X Scheduler: Unsupported RRULE property "FOO". Supported properties are: FREQ, INTERVAL, BYDAY, BYMONTHDAY, BYMONTH, UNTIL, COUNT. Remove or replace the unsupported property.',
      );
    });

    it('should throw for invalid INTERVAL value', () => {
      expect(() => parseRRule('FREQ=DAILY;INTERVAL=zero', 'default')).to.throw(
        'MUI X Scheduler: Invalid INTERVAL value "ZERO". INTERVAL must be a positive integer (1 or greater). Provide a valid interval value.',
      );
    });

    it('should throw for INTERVAL values that are not finite integers', () => {
      expect(() => parseRRule('FREQ=DAILY;INTERVAL=1.5', 'default')).to.throw(
        'MUI X Scheduler: Invalid INTERVAL value "1.5".',
      );
      expect(() => parseRRule('FREQ=DAILY;INTERVAL=1e999', 'default')).to.throw(
        'MUI X Scheduler: Invalid INTERVAL value "1E999".',
      );
    });

    it('should throw for invalid BYMONTHDAY values', () => {
      expect(() => parseRRule('FREQ=MONTHLY;BYMONTHDAY=0,50', 'default')).to.throw(
        'MUI X Scheduler: Invalid BYMONTHDAY values "0,50". BYMONTHDAY values must be integers between 1 and 31. Provide valid day of month values.',
      );
      expect(() => parseRRule('FREQ=MONTHLY;BYMONTHDAY=1.5', 'default')).to.throw(
        'MUI X Scheduler: Invalid BYMONTHDAY values "1.5".',
      );
    });

    it('should throw for byMonthDay values of a rule object that are not integers between 1 and 31', () => {
      for (const byMonthDay of [[-1], [0], [1.5], [32], [1, NaN]]) {
        expect(() => parseRRule({ freq: 'MONTHLY', byMonthDay }, 'default')).to.throw(
          `MUI X Scheduler: Invalid BYMONTHDAY values "${byMonthDay.join(',')}". BYMONTHDAY values must be integers between 1 and 31.`,
        );
      }
    });

    it('should throw for invalid BYMONTH values', () => {
      expect(() => parseRRule('FREQ=YEARLY;BYMONTH=0,13', 'default')).to.throw(
        'MUI X Scheduler: Invalid BYMONTH values "0,13". BYMONTH values must be integers between 1 and 12. Provide valid month values.',
      );
    });

    it('should throw for invalid COUNT value', () => {
      expect(() => parseRRule('FREQ=DAILY;COUNT=-2', 'default')).to.throw(
        'MUI X Scheduler: Invalid COUNT value "-2". COUNT must be a positive integer (1 or greater). Provide a valid count value.',
      );
    });

    describe('rules whose occurrences cannot be computed', () => {
      it.each([
        [
          'COUNT and UNTIL',
          'FREQ=DAILY;COUNT=3;UNTIL=20250315T000000Z',
          { freq: 'DAILY', count: 3, until: '2025-03-15T00:00:00Z' },
          /both count and until/,
        ],
        [
          'ordinal BYDAY in a weekly rule',
          'FREQ=WEEKLY;BYDAY=1MO',
          { freq: 'WEEKLY', byDay: ['1MO'] },
          /without ordinals/,
        ],
        [
          'BYDAY and BYMONTHDAY in a monthly rule',
          'FREQ=MONTHLY;BYDAY=2TU;BYMONTHDAY=10',
          { freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] },
          /both byDay and byMonthDay/,
        ],
        [
          'several BYDAY values in a monthly rule',
          'FREQ=MONTHLY;BYDAY=2TU,-1FR',
          { freq: 'MONTHLY', byDay: ['2TU', '-1FR'] },
          /single element with an ordinal/,
        ],
        [
          'several BYMONTHDAY values in a monthly rule with COUNT',
          'FREQ=MONTHLY;BYMONTHDAY=1,15;COUNT=5',
          { freq: 'MONTHLY', byMonthDay: [1, 15], count: 5 },
          /single byMonthDay value/,
        ],
        [
          'BYMONTH in a yearly rule',
          'FREQ=YEARLY;BYMONTH=6',
          { freq: 'YEARLY', byMonth: [6] },
          /Yearly recurrences only support/,
        ],
      ] as const)(
        'should throw for %s, from a string or an object',
        (_name, string, object, message) => {
          expect(() => parseRRule(string, 'default')).to.throw(message);
          expect(() => parseRRule(object as SchedulerEventRecurrenceRule, 'default')).to.throw(
            message,
          );
        },
      );
    });

    it('should count an object INTERVAL below 1 as 1 and truncate a fractional one', () => {
      expect(parseRRule({ freq: 'DAILY', interval: 0 }, 'default').interval).to.equal(1);
      expect(parseRRule({ freq: 'DAILY', interval: 2.5 }, 'default').interval).to.equal(2);
    });

    it('should throw for an object INTERVAL that is not finite', () => {
      expect(() => parseRRule({ freq: 'DAILY', interval: Infinity }, 'default')).to.throw(
        'MUI X Scheduler: Invalid INTERVAL value "Infinity".',
      );
    });

    it('should trim whitespace and handle lowercase properties', () => {
      const result = parseRRule('  freq=weekly ; byday= mo, tu  ; interval= 3 ', 'default');
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
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=DAILY');
    });

    it('should include INTERVAL only when different from 1', () => {
      const ruleWithInterval1 = { freq: 'DAILY' as const, interval: 1 };
      const resultWithoutInterval = serializeRRule(ruleWithInterval1);
      expect(resultWithoutInterval).to.equal('FREQ=DAILY');

      const ruleWithInterval2 = { freq: 'DAILY' as const, interval: 2 };
      const resultWithInterval = serializeRRule(ruleWithInterval2);
      expect(resultWithInterval).to.equal('FREQ=DAILY;INTERVAL=2');
    });

    it('should serialize BYDAY correctly', () => {
      const rule = {
        freq: 'WEEKLY' as const,
        byDay: ['MO', 'WE', 'FR'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });

    it('should serialize BYMONTHDAY correctly', () => {
      const rule = { freq: 'MONTHLY' as const, byMonthDay: [5, 15, 28] };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=MONTHLY;BYMONTHDAY=5,15,28');
    });

    it('should serialize BYMONTH correctly', () => {
      const rule = { freq: 'YEARLY' as const, byMonth: [1, 6, 12] };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=YEARLY;BYMONTH=1,6,12');
    });

    it('should serialize COUNT correctly', () => {
      const rule = { freq: 'DAILY' as const, count: 5 };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=DAILY;COUNT=5');
    });

    it('should serialize UNTIL as a date', () => {
      const rule = { freq: 'DAILY' as const, until: BaseTemporal.PlainDate.from('2025-03-15') };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=DAILY;UNTIL=20250315');
    });

    it('should combine multiple properties correctly', () => {
      const until = BaseTemporal.PlainDate.from('2025-03-15');
      const rule = {
        freq: 'WEEKLY' as const,
        interval: 2,
        byDay: ['MO', 'FR'] as RecurringEventByDayValue[],
        until,
      };

      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;UNTIL=20250315');
    });

    it('should handle empty BYDAY, BYMONTHDAY AND BYMONTHgracefully', () => {
      const ruleWithEmptyByDay = { freq: 'WEEKLY' as const, byDay: [] };
      const resultWithoutByDay = serializeRRule(ruleWithEmptyByDay);
      expect(resultWithoutByDay).to.equal('FREQ=WEEKLY');

      const ruleWithEmptyByMonthDay = { freq: 'MONTHLY' as const, byMonthDay: [] };
      const resultWithoutByMonthDay = serializeRRule(ruleWithEmptyByMonthDay);
      expect(resultWithoutByMonthDay).to.equal('FREQ=MONTHLY');

      const ruleWithEmptyByMonth = { freq: 'YEARLY' as const, byMonth: [] };
      const resultWithoutByMonth = serializeRRule(ruleWithEmptyByMonth);
      expect(resultWithoutByMonth).to.equal('FREQ=YEARLY');
    });

    it('should serialize BYDAY values in correct order regardless of input order', () => {
      const rule = {
        freq: 'WEEKLY' as const,
        byDay: ['FR', 'MO', 'WE'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });

    it('should serialize BYDAY with ordinals in correct order', () => {
      const rule = {
        freq: 'MONTHLY' as const,
        byDay: ['2TU', '-1FR', '1MO'] as RecurringEventByDayValue[],
      };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=MONTHLY;BYDAY=1MO,2TU,-1FR');
    });

    it('should serialize BYMONTHDAY and BYMONTH sorted numerically', () => {
      const rule = { freq: 'YEARLY' as const, byMonthDay: [28, 5, 15], byMonth: [12, 1, 6] };
      const result = serializeRRule(rule);
      expect(result).to.equal('FREQ=YEARLY;BYMONTHDAY=5,15,28;BYMONTH=1,6,12');
    });

    it.each([
      { allDay: true, until: '20250315' },
      { allDay: false, until: '20250315T093000Z' },
    ])('should round-trip UNTIL=$until for allDay=$allDay', ({ allDay, until }) => {
      const input = `FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;UNTIL=${until}`;
      const parsed = parseRRule(input, 'America/New_York', allDay);
      const serialized = serializeRRule(parsed, 'America/New_York');
      expect(serialized).to.equal(input);
    });

    it('should round-trip even if BYDAY order differs in input', () => {
      const input = 'FREQ=WEEKLY;BYDAY=FR,MO,WE';
      const parsed = parseRRule(input, 'default');
      const serialized = serializeRRule(parsed);
      expect(serialized).to.equal('FREQ=WEEKLY;BYDAY=MO,WE,FR');
    });
  });
});
