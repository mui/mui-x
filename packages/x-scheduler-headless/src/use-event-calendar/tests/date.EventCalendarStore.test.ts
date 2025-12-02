import { spy } from 'sinon';
import { adapter } from 'test/utils/scheduler';
import { EventCalendarStore } from '../EventCalendarStore';
import { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

describe('Date - EventCalendarStore', () => {
  describe('Method: switchToDay', () => {
    it('should update store and calls both callbacks when both change when is uncontrolled', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const initialDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          defaultVisibleDate: initialDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);

      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(nextDate);
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should NOT mutate store but calls both callbacks when both change when is controlled', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const initialDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          visibleDate: initialDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime(initialDate);

      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(nextDate);
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should update date in store and calls onVisibleDateChange if only date changes when is uncontrolled', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'day',
          defaultVisibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);
      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onViewChange.called).to.equal(false);
    });

    it('should update date and calls only onVisibleDateChange when is partially controlled (view controlled, visibleDate uncontrolled)', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          defaultVisibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);
      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onViewChange.called).to.equal(false);
    });

    it('should update view and calls only onViewChange when is partially controlled (view uncontrolled, visibleDate controlled)', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          visibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(currentDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(currentDate);
      expect(onVisibleDateChange.calledOnce).to.equal(false);
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should do nothing if nothing changes, does not update store or call callbacks', () => {
      const onVisibleDateChange = spy();
      const onViewChange = spy();

      const sameDate = adapter.date('2025-08-02T00:00:00Z', 'default');
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: sameDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(sameDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(sameDate);
      expect(onVisibleDateChange.called).to.equal(false);
      expect(onViewChange.called).to.equal(false);
    });

    it('should throw if the view is not an allowed view', () => {
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, views: ['week', 'month', 'agenda'] as CalendarView[] },
        adapter,
      );
      const newDate = adapter.date('2025-08-02T00:00:00Z', 'default');
      expect(() => store.switchToDay(newDate, {} as any)).to.throw(
        /not compatible with the available views/i,
      );
    });
  });

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z', 'default');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
          onVisibleDateChange,
        },
        adapter,
      );

      store.setViewConfig({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });
      store.goToPreviousVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.firstArg.delta).toEqual(-1);
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z', 'default');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
          onVisibleDateChange,
        },
        adapter,
      );

      store.setViewConfig({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });
      store.goToNextVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.firstArg.delta).toEqual(1);
    });
  });
});
