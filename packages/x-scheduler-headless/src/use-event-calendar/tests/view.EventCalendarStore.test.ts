import { spy } from 'sinon';
import { adapter } from 'test/utils/scheduler';
import { EventCalendarStore } from '../EventCalendarStore';
import { EventCalendarState } from '../EventCalendarStore.types';

const DEFAULT_PARAMS = { events: [] };

describe('View - EventCalendarStore', () => {
  describe('Method: setView', () => {
    it('should update view and call onViewChange when value changes and is uncontrolled', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onViewChange }, adapter);

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('day');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should NOT mutate store but calls onViewChange when is controlled', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, view: 'week', onViewChange },
        adapter,
      );

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('week');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should do nothing if setting the same view: no state change, no callback', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, defaultView: 'month', onViewChange },
        adapter,
      );

      store.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.called).to.equal(false);
    });

    it('should throw when switching to a view not included in the allowed views', () => {
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, views: ['day', 'agenda'], defaultView: 'day' },
        adapter,
      );

      expect(() => store.setView('week', {} as any)).to.throw(/not compatible/i);
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          onViewChange: (_, eventDetails) => eventDetails.cancel(),
        },
        adapter,
      );

      store.setView('day', {} as any);
      expect(store.state.view).to.equal('week');
    });
  });

  describe('Method: switchToDay', () => {
    it('should update view and visibleDate when value changes and is uncontrolled', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime('2025-07-01');
    });

    it('should update view but not visibleDate when value changes and visibleDate is controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          visibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });

    it('should update visibleDate but not view when view is controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          defaultVisibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-07-01');
    });

    it('should NOT mutate store when both view and visibleDate are controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          visibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          defaultVisibleDate: adapter.date('2025-06-15', 'default'),
          onViewChange: (_, eventDetails) => eventDetails.cancel(),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);
      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });
  });

  describe('Method: setViewConfig', () => {
    it('should set config and cleanup to null', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const siblingVisibleDateGetter = spy(
        ({ state }: { state: EventCalendarState }) => state.visibleDate,
      );
      const cleanup = store.setViewConfig({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });

      expect(store.state.viewConfig?.siblingVisibleDateGetter).to.equal(siblingVisibleDateGetter);

      cleanup();

      expect(store.state.viewConfig).to.equal(null);
    });
  });
});
