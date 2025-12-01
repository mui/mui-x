import { adapter } from 'test/utils/scheduler';
import { RecurringEventRecurrenceRule } from '../models';
import { processDate } from '../process-date';
import { schedulerRecurringEventSelectors } from './schedulerRecurringEventSelectors';
import { storeClasses } from '../utils/SchedulerStore/tests/utils';

storeClasses.forEach((storeClass) => {
  describe(`schedulerRecurringEventSelectors - ${storeClass.name}`, () => {
    describe('defaultPresetKey', () => {
      const state = new storeClass.Value({ events: [] }, adapter).state;

      it('should return null when rule is undefined', () => {
        const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
        expect(schedulerRecurringEventSelectors.defaultPresetKey(state, undefined, start)).to.equal(
          null,
        );
      });

      describe('DAILY preset', () => {
        it('should return DAILY for a basic daily rule with interval 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
            interval: 1,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'DAILY',
          );
        });

        it('should return DAILY for a daily rule without explicit interval (defaults to 1)', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'DAILY',
          );
        });

        it('should return custom for a daily rule with interval > 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
            interval: 2,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a daily rule with count', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
            interval: 1,
            count: 5,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a daily rule with until', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
            interval: 1,
            until: adapter.date('2025-12-31', 'default'),
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a daily rule with byDay', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'DAILY',
            interval: 1,
            byDay: ['MO'],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });
      });

      describe('WEEKLY preset', () => {
        it('should return WEEKLY for a basic weekly rule with interval 1 and no byDay', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'WEEKLY',
          );
        });

        it('should return WEEKLY for a weekly rule with byDay matching the start day', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter); // Tuesday
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['TU'],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'WEEKLY',
          );
        });

        it('should return custom for a weekly rule with multiple byDay values', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['TU', 'WE'],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a weekly rule with byDay not matching the start day', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter); // Tuesday
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byDay: ['MO'],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a weekly rule with interval > 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 2,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a weekly rule with count', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            count: 10,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a weekly rule with byMonthDay', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'WEEKLY',
            interval: 1,
            byMonthDay: [5],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });
      });

      describe('MONTHLY preset', () => {
        it('should return MONTHLY for a basic monthly rule with interval 1 and no byMonthDay', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'MONTHLY',
          );
        });

        it('should return MONTHLY for a monthly rule with byMonthDay matching the start day', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter); // 5th
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [5],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'MONTHLY',
          );
        });

        it('should return custom for a monthly rule with byMonthDay not matching the start day', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter); // 5th
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [26],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a monthly rule with multiple byMonthDay values', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [5, 15],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a monthly rule with interval > 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 2,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a monthly rule with count', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            count: 12,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a monthly rule with byDay', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['MO'],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });
      });

      describe('YEARLY preset', () => {
        it('should return YEARLY for a basic yearly rule with interval 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
            interval: 1,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'YEARLY',
          );
        });

        it('should return YEARLY for a yearly rule without explicit interval', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'YEARLY',
          );
        });

        it('should return custom for a yearly rule with interval > 1', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
            interval: 2,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a yearly rule with count', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
            interval: 1,
            count: 5,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a yearly rule with until', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
            interval: 1,
            until: adapter.date('2030-12-31', 'default'),
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });

        it('should return custom for a yearly rule with byMonth', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'YEARLY',
            interval: 1,
            byMonth: [8],
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });
      });

      describe('unknown frequency', () => {
        it('should return custom for an unknown frequency', () => {
          const start = processDate(adapter.date('2025-08-05T09:00:00', 'default'), adapter);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'SECONDLY' as any,
            interval: 1,
          };
          expect(schedulerRecurringEventSelectors.defaultPresetKey(state, rule, start)).to.equal(
            'custom',
          );
        });
      });
    });
  });
});
