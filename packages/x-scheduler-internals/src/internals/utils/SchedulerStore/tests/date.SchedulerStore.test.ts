import { adapter, ResourceBuilder, storeClasses } from 'test/utils/scheduler';
import { describe, it, expect, vi } from 'vitest';

const DEFAULT_PARAMS = { events: [], resources: [ResourceBuilder.new().build()] };

storeClasses.forEach((storeClass) => {
  describe(`Date - ${storeClass.name}`, () => {
    describe('Method: goToToday', () => {
      it('should set visibleDate to startOfDay(adapter.now("default")) and calls onVisibleDateChange when is uncontrolled', () => {
        const onVisibleDateChange = vi.fn();
        const yesterday = adapter.addDays(adapter.startOfDay(adapter.now('default')), -1);
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, onVisibleDateChange, defaultVisibleDate: yesterday },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.now('default'));
        expect(store.state.visibleDate).toEqualDateTime(expected);
        expect(onVisibleDateChange.mock.calls.length).to.equal(1);
        expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(expected);
      });

      it('should not change the state but calls onVisibleDateChange with today when is controlled', () => {
        const onVisibleDateChange = vi.fn();
        const controlledDate = adapter.date('2025-07-01T00:00:00Z', 'default');

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleDate: controlledDate, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.now('default'));
        expect(store.state.visibleDate).toEqualDateTime(controlledDate);
        expect(onVisibleDateChange.mock.calls.length).to.equal(1);
        expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(expected);
      });

      it('should do nothing if already at today (no state change, no callback)', () => {
        const onVisibleDateChange = vi.fn();
        const todayStart = adapter.startOfDay(adapter.now('default'));

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate: todayStart, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        expect(store.state.visibleDate).toEqualDateTime(todayStart);
        expect(onVisibleDateChange.mock.calls.length).to.equal(0);
      });

      it('should use the provided display timezone when going to today (uncontrolled)', () => {
        const onVisibleDateChange = vi.fn();
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
        expect(onVisibleDateChange.mock.calls.length).to.equal(1);
        expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(expected);
      });
    });

    describe('Method: goToDate', () => {
      it('should set visibleDate to the provided date and call onVisibleDateChange when uncontrolled', () => {
        const onVisibleDateChange = vi.fn();
        const initialDate = adapter.date('2025-05-26T00:00:00Z', 'default');
        const targetDate = adapter.date('2025-06-15T10:30:00Z', 'default');
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, onVisibleDateChange, defaultVisibleDate: initialDate },
          adapter,
        );

        store.goToDate(targetDate, {} as any);

        expect(store.state.visibleDate).toEqualDateTime(targetDate);
        expect(onVisibleDateChange.mock.calls.length).to.equal(1);
        expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(targetDate);
      });

      it('should not change state but call onVisibleDateChange when controlled', () => {
        const onVisibleDateChange = vi.fn();
        const controlledDate = adapter.date('2025-07-01T00:00:00Z', 'default');
        const targetDate = adapter.date('2025-08-15T00:00:00Z', 'default');
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleDate: controlledDate, onVisibleDateChange },
          adapter,
        );

        store.goToDate(targetDate, {} as any);

        expect(store.state.visibleDate).toEqualDateTime(controlledDate);
        expect(onVisibleDateChange.mock.calls.length).to.equal(1);
        expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(targetDate);
      });

      it('should do nothing if already at the target date', () => {
        const onVisibleDateChange = vi.fn();
        const targetDate = adapter.date('2025-05-26T00:00:00Z', 'default');
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate: targetDate, onVisibleDateChange },
          adapter,
        );

        store.goToDate(targetDate, {} as any);

        expect(store.state.visibleDate).toEqualDateTime(targetDate);
        expect(onVisibleDateChange.mock.calls.length).to.equal(0);
      });
    });
  });
});
