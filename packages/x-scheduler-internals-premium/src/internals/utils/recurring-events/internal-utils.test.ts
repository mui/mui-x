import { adapter, adapterFr } from 'test/utils/scheduler';
import type {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import {
  tokenizeByDay,
  parsesByDayForWeeklyFrequency,
  parsesByDayForMonthlyFrequency,
  NOT_LOCALIZED_WEEK_DAYS,
  getWeekDayCode,
} from './internal-utils';

describe('recurring-events/internal-utils', () => {
  describe('getWeekDayCode', () => {
    it('should work with fr (week starts on Monday)', () => {
      const testMonday = adapterFr.date('2025-10-20T00:00:00Z', 'default'); // Monday
      expect(getWeekDayCode(adapterFr, testMonday)).to.equal('MO');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 1))).to.equal('TU');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 2))).to.equal('WE');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 3))).to.equal('TH');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 4))).to.equal('FR');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 5))).to.equal('SA');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 6))).to.equal('SU');
    });

    it('should work with enUS (week starts on Sunday)', () => {
      const testMonday = adapter.date('2025-10-20T00:00:00Z', 'default'); // Monday
      expect(getWeekDayCode(adapter, testMonday)).to.equal('MO');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 1))).to.equal('TU');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 2))).to.equal('WE');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 3))).to.equal('TH');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 4))).to.equal('FR');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 5))).to.equal('SA');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 6))).to.equal('SU');
    });
  });

  describe('BYDAY parsers: tokenizeByDay / parseWeeklyByDayPlain / parseMonthlyByDayOrdinalSingle', () => {
    describe('tokenizeByDay', () => {
      it('parses plain byDay codes without ordinal', () => {
        NOT_LOCALIZED_WEEK_DAYS.forEach((code) => {
          const res = tokenizeByDay(code);
          expect(res).to.deep.equal({ ord: null, code });
        });
      });

      it('parses positive ordinals', () => {
        const cases: Array<[RecurringEventByDayValue, number, RecurringEventWeekDayCode]> = [
          ['1MO', 1, 'MO'],
          ['2TU', 2, 'TU'],
          ['3WE', 3, 'WE'],
          ['4TH', 4, 'TH'],
          ['5FR', 5, 'FR'],
        ];
        cases.forEach(([input, ord, code]) => {
          const res = tokenizeByDay(input);
          expect(res.ord).to.equal(ord);
          expect(res.code).to.equal(code);
        });
      });

      it('parses negative ordinals (-1..-5)', () => {
        const cases: Array<[RecurringEventByDayValue, number, RecurringEventWeekDayCode]> = [
          ['-1MO', -1, 'MO'],
          ['-2TU', -2, 'TU'],
          ['-3WE', -3, 'WE'],
          ['-4TH', -4, 'TH'],
          ['-5FR', -5, 'FR'],
        ];
        cases.forEach(([input, ord, code]) => {
          const res = tokenizeByDay(input);
          expect(res.ord).to.equal(ord);
          expect(res.code).to.equal(code);
        });
      });

      it('throws on invalid ordinal range or malformed strings', () => {
        const invalidInputs = [
          '0MO',
          '6MO',
          '-6FR',
          'MO2',
          '2XX',
          '',
          '12MO',
          '--1MO',
          '1SUU',
          'mo',
        ];

        invalidInputs.forEach((input) => {
          expect(() => tokenizeByDay(input as RecurringEventWeekDayCode)).to.throw();
        });
      });
    });

    describe('parseWeeklyByDayPlain', () => {
      it('returns null when ruleByDay is undefined or empty', () => {
        // ruleByDay is undefined
        expect(parsesByDayForWeeklyFrequency(undefined)).to.deep.equal(null);

        // ruleByDay is empty
        expect(parsesByDayForWeeklyFrequency([])).to.deep.equal(null);
      });

      it('accepts plain byDay codes and returns them unchanged', () => {
        const byDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['MO', 'WE', 'FR'];
        expect(parsesByDayForWeeklyFrequency(byDay)).to.deep.equal(['MO', 'WE', 'FR']);
      });

      it('throws when any ordinal is provided (e.g., 1MO, -1FR)', () => {
        const withOrdinal: SchedulerProcessedEventRecurrenceRule['byDay'] = ['1MO', '-1FR'];
        expect(() => parsesByDayForWeeklyFrequency(withOrdinal)).to.throw();
      });

      it('throws for invalid BYDAY values (e.g., XX)', () => {
        expect(() => parsesByDayForWeeklyFrequency(['XX' as any])).to.throw();
      });
    });

    describe('parseMonthlyByDayOrdinalSingle', () => {
      it('throws when ruleByDay is empty or multiple', () => {
        expect(() => parsesByDayForMonthlyFrequency([])).to.throw();
        expect(() => parsesByDayForMonthlyFrequency(['1MO', '2TU'])).to.throw();
      });

      it('parses one ordinal byDay code (e.g., 1MO, 3WE, -1FR)', () => {
        const byDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['1FR'];
        expect(parsesByDayForMonthlyFrequency(byDay)).to.deep.equal({ ord: 1, code: 'FR' });
        const negativeByDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['-1MO'];
        expect(parsesByDayForMonthlyFrequency(negativeByDay)).to.deep.equal({
          ord: -1,
          code: 'MO',
        });
      });

      it('throws when any entry lacks an ordinal (e.g., plain MO)', () => {
        const mixed: SchedulerProcessedEventRecurrenceRule['byDay'] = ['2TU', 'MO'];
        expect(() => parsesByDayForMonthlyFrequency(mixed)).to.throw();
      });
    });
  });
});
