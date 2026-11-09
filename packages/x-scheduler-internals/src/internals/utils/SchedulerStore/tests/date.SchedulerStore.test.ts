import { adapter, ResourceBuilder, setSystemTimezone, storeClasses } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect, onTestFinished } from 'vitest';

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

      // Browsers cannot change their timezone through process.env.TZ.
      it.skipIf(!isJSDOM)(
        'should go to the end of the gap when the default timezone skips midnight',
        () => {
          vi.useFakeTimers();
          onTestFinished(() => {
            vi.useRealTimers();
          });
          // Havana skips from 00:00 to 01:00 on March 8th, 2026.
          setSystemTimezone('America/Havana');
          vi.setSystemTime(new Date('2026-03-08T12:00:00Z'));
          const onVisibleDateChange = vi.fn();
          const store = new storeClass.Value(
            {
              ...DEFAULT_PARAMS,
              defaultVisibleDate: adapter.date('2026-03-01T12:00:00Z', 'default'),
              onVisibleDateChange,
            },
            adapter,
          );

          store.goToToday({} as any);

          expect(adapter.getTime(onVisibleDateChange.mock.lastCall?.[0])).to.equal(
            Date.parse('2026-03-08T05:00:00Z'),
          );
        },
      );
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
