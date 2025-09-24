import { spy } from 'sinon';
import { getAdapter } from '../../adapter/getAdapter';
import { storeClasses } from './utils';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

storeClasses.forEach((storeClass) => {
  describe(`Date - ${storeClass.name}`, () => {
    describe('Method: goToToday', () => {
      it('should set visibleDate to startOfDay(adapter.date()) and calls onVisibleDateChange when is uncontrolled', () => {
        const onVisibleDateChange = spy();
        const yesterday = adapter.addDays(adapter.startOfDay(adapter.date()), -1);
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, onVisibleDateChange, defaultVisibleDate: yesterday },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.date());
        expect(store.state.visibleDate).toEqualDateTime(expected);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
      });

      it('should not change the state but calls onVisibleDateChange with today when is controlled', () => {
        const onVisibleDateChange = spy();
        const controlledDate = adapter.date('2025-07-01T00:00:00Z');

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleDate: controlledDate, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        const expected = adapter.startOfDay(adapter.date());
        expect(store.state.visibleDate).toEqualDateTime(controlledDate);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
      });

      it('should do nothing if already at today (no state change, no callback)', () => {
        const onVisibleDateChange = spy();
        const todayStart = adapter.startOfDay(adapter.date());

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, defaultVisibleDate: todayStart, onVisibleDateChange },
          adapter,
        );

        store.goToToday({} as any);

        expect(store.state.visibleDate).toEqualDateTime(todayStart);
        expect(onVisibleDateChange.called).to.equal(false);
      });
    });
  });
});
