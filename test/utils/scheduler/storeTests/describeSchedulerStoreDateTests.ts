import { spy } from 'sinon';
import { adapter } from '../index';
import type { SchedulerStoreClassDescriptor } from './types';

const DEFAULT_PARAMS = { events: [] };

export function describeSchedulerStoreDateTests(storeClass: SchedulerStoreClassDescriptor) {
  describe(`SchedulerStore Date - ${storeClass.name}`, () => {
    describe('Method: goToToday', () => {
      it('should set visibleDate to startOfDay(adapter.now("default")) and calls onVisibleDateChange when is uncontrolled', () => {
        const onVisibleDateChange = spy();
        const yesterday = adapter.addDays(adapter.startOfDay(adapter.now('default')), -1);
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, onVisibleDateChange, defaultVisibleDate: yesterday },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.now('default'));
        expect(store.state.visibleDate).toEqualDateTime(expected);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
      });

      it('should not change the state but calls onVisibleDateChange with today when is controlled', () => {
        const onVisibleDateChange = spy();
        const controlledDate = adapter.date('2025-07-01T00:00:00Z', 'default');

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleDate: controlledDate, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.now('default'));
        expect(store.state.visibleDate).toEqualDateTime(controlledDate);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
      });

      it('should do nothing if already at today (no state change, no callback)', () => {
        const onVisibleDateChange = spy();
        const todayStart = adapter.startOfDay(adapter.now('default'));

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate: todayStart, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        expect(store.state.visibleDate).toEqualDateTime(todayStart);
        expect(onVisibleDateChange.called).to.equal(false);
      });

      it('should use the provided display timezone when going to today (uncontrolled)', () => {
        const onVisibleDateChange = spy();
        const displayTimezone = 'Pacific/Kiritimati';

        const yesterday = adapter.addDays(adapter.startOfDay(adapter.now('default')), -1);

        const store = new storeClass.Value(
          {
            ...DEFAULT_PARAMS,
            defaultVisibleDate: yesterday,
            onVisibleDateChange,
            displayTimezone,
          },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.now(displayTimezone));

        expect(store.state.visibleDate).toEqualDateTime(expected);
        expect(store.state.displayTimezone).to.equal(displayTimezone);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
      });
    });
  });
}
