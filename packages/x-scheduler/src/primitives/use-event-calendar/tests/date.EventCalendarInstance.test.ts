import { spy } from 'sinon';
import { EventCalendarInstance } from '@mui/x-scheduler/primitives/use-event-calendar/EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';
import { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Date - EventCalendarInstance', () => {
  describe('Method: goToToday', () => {
    it('uncontrolled: sets visibleDate to startOfDay(adapter.date()) and calls onVisibleDateChange', () => {
      const onVisibleDateChange = spy();
      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, onVisibleDateChange },
        adapter,
      );

      const yesterday = adapter.addDays(adapter.startOfDay(adapter.date()), -1);
      store.set('visibleDate', yesterday);

      instance.goToToday({} as any);

      const expected = adapter.startOfDay(adapter.date());
      expect(store.state.visibleDate).toEqualDateTime(expected);
      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
    });

    it('controlled: does not change the state but calls onVisibleDateChange with today', () => {
      const onVisibleDateChange = spy();
      const controlledDate = adapter.date('2025-07-01T00:00:00Z');

      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, visibleDate: controlledDate, onVisibleDateChange },
        adapter,
      );

      instance.goToToday({} as any);

      const expected = adapter.startOfDay(adapter.date());
      expect(store.state.visibleDate).toEqualDateTime(controlledDate);
      expect(onVisibleDateChange.calledOnce).to.equal(true);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(expected);
    });

    it('no-op if already at today (no state change, no callback)', () => {
      const onVisibleDateChange = spy();
      const todayStart = adapter.startOfDay(adapter.date());

      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, onVisibleDateChange },
        adapter,
      );

      store.set('visibleDate', todayStart);
      instance.goToToday({} as any);

      expect(store.state.visibleDate).toEqualDateTime(todayStart);
      expect(onVisibleDateChange.called).to.equal(false);
    });
  });

  describe('Method: switchToDay', () => {
    describe('Method: switchToDay', () => {
      it('uncontrolled: updates store and calls both callbacks when both change', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const initialDate = adapter.date('2025-08-01T00:00:00Z');
        const nextDate = adapter.date('2025-08-02T00:00:00Z');

        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            defaultView: 'week',
            defaultVisibleDate: initialDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(nextDate, {} as any);

        expect(store.state.view).to.equal('day');
        expect(store.state.visibleDate).toEqualDateTime(nextDate);

        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(nextDate);
        expect(onViewChange.calledOnce).to.equal(true);
        expect(onViewChange.lastCall.firstArg).to.equal('day');
      });

      it('controlled: does NOT mutate store but calls both callbacks when both change', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const initialDate = adapter.date('2025-08-01T00:00:00Z');
        const nextDate = adapter.date('2025-08-02T00:00:00Z');

        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            view: 'week',
            visibleDate: initialDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(nextDate, {} as any);

        expect(store.state.view).to.equal('week');
        expect(store.state.visibleDate).toEqualDateTime(initialDate);

        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(nextDate);
        expect(onViewChange.calledOnce).to.equal(true);
        expect(onViewChange.lastCall.firstArg).to.equal('day');
      });

      it('uncontrolled: only date changes, updates date in store and calls only onVisibleDateChange', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const currentDate = adapter.date('2025-08-01T00:00:00Z');
        const nextDate = adapter.date('2025-08-02T00:00:00Z');

        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            defaultView: 'day',
            defaultVisibleDate: currentDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(nextDate, {} as any);

        expect(store.state.view).to.equal('day');
        expect(store.state.visibleDate).toEqualDateTime(nextDate);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onViewChange.called).to.equal(false);
      });

      it('partially controlled: view controlled, visibleDate uncontrolled → updates date and calls only onVisibleDateChange', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const currentDate = adapter.date('2025-08-01T00:00:00Z');
        const nextDate = adapter.date('2025-08-02T00:00:00Z');

        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            view: 'day',
            defaultVisibleDate: currentDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(nextDate, {} as any);

        expect(store.state.view).to.equal('day');
        expect(store.state.visibleDate).toEqualDateTime(nextDate);
        expect(onVisibleDateChange.calledOnce).to.equal(true);
        expect(onViewChange.called).to.equal(false);
      });

      it('partially controlled: view uncontrolled, visibleDate controlled → updates view and calls only onViewChange', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const currentDate = adapter.date('2025-08-01T00:00:00Z');

        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            defaultView: 'week',
            visibleDate: currentDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(currentDate, {} as any);

        expect(store.state.view).to.equal('day');
        expect(store.state.visibleDate).toEqualDateTime(currentDate);
        expect(onVisibleDateChange.calledOnce).to.equal(false);
        expect(onViewChange.calledOnce).to.equal(true);
        expect(onViewChange.lastCall.firstArg).to.equal('day');
      });

      it('no-op when nothing changes: does not update store or call callbacks', () => {
        const onVisibleDateChange = spy();
        const onViewChange = spy();

        const sameDate = adapter.date('2025-08-02T00:00:00Z');
        const { instance, store } = EventCalendarInstance.create(
          {
            ...DEFAULT_PARAMS,
            view: 'day',
            visibleDate: sameDate,
            onVisibleDateChange,
            onViewChange,
          },
          adapter,
        );

        instance.switchToDay(sameDate, {} as any);

        expect(store.state.view).to.equal('day');
        expect(store.state.visibleDate).toEqualDateTime(sameDate);
        expect(onVisibleDateChange.called).to.equal(false);
        expect(onViewChange.called).to.equal(false);
      });

      it('throws if the view is not an allowed view', () => {
        const { instance } = EventCalendarInstance.create(
          { ...DEFAULT_PARAMS, views: ['week', 'month', 'agenda'] as CalendarView[] },
          adapter,
        );
        const newDate = adapter.date('2025-08-02T00:00:00Z');
        expect(() => instance.switchToDay(newDate, {} as any)).to.throw(
          /not compatible with the available views/i,
        );
      });
    });
  });

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { instance } = EventCalendarInstance.create(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z'),
          onVisibleDateChange,
        },
        adapter,
      );

      instance.setViewConfig({ siblingVisibleDateGetter });
      instance.goToPreviousVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(-1);
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = spy();
      const targetDate = adapter.date('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = spy(() => targetDate);

      const { instance } = EventCalendarInstance.create(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z'),
          onVisibleDateChange,
        },
        adapter,
      );

      instance.setViewConfig({ siblingVisibleDateGetter });
      instance.goToNextVisibleDate({} as any);
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.lastCall.lastArg).toEqual(1);
    });
  });
});
