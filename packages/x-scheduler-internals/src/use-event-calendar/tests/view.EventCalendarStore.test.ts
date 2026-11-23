import { createDate } from 'test/utils/scheduler';
import { vi, describe, it, expect } from 'vitest';
import { EventCalendarStore } from '../EventCalendarStore';
import type { EventCalendarState } from '../EventCalendarStore.types';

const DEFAULT_PARAMS = { events: [] };

describe('View - EventCalendarStore', () => {
  describe('Method: setView', () => {
    it('should update view and call onViewChange when value changes and is uncontrolled', () => {
      const onViewChange = vi.fn();
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onViewChange });

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('day');
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should NOT mutate store but calls onViewChange when is controlled', () => {
      const onViewChange = vi.fn();
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'week', onViewChange });

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('week');
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should do nothing if setting the same view: no state change, no callback', () => {
      const onViewChange = vi.fn();
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'month',
        onViewChange,
      });

      store.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should throw when switching to a view not included in the allowed views', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        views: ['day', 'agenda'],
        defaultView: 'day',
      });

      expect(() => store.setView('week', {} as any)).to.throw(/is not part of the `views` prop/i);
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'week',
        onViewChange: (_, eventDetails) => eventDetails.cancel(),
      });

      store.setView('day', {} as any);
      expect(store.state.view).to.equal('week');
    });

    it('should warn in dev when controlled without an onViewChange handler', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'week' });

      expect(() => store.setView('day', {} as any)).toWarnDev(
        'MUI X Scheduler: EventCalendar is controlled (received a `view` prop) but `onViewChange` is not provided',
      );
    });
  });

  describe('Method: switchToDay', () => {
    it('should update view but not visibleDate when value changes and visibleDate is controlled', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'week',
        visibleDate: createDate('2025-06-15'),
      });

      store.switchToDay(createDate('2025-07-01'), {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });

    it('should update visibleDate but not view when view is controlled', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        view: 'week',
        defaultVisibleDate: createDate('2025-06-15'),
      });

      store.switchToDay(createDate('2025-07-01'), {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-07-01');
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'week',
        defaultVisibleDate: createDate('2025-06-15'),
        onViewChange: (_, eventDetails) => eventDetails.cancel(),
      });

      store.switchToDay(createDate('2025-07-01'), {} as any);
      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });
  });

  describe('Init validation', () => {
    it('should throw at init when the initial view is not included in the views array', () => {
      expect(
        () =>
          new EventCalendarStore({
            ...DEFAULT_PARAMS,
            defaultView: 'week',
            views: ['day', 'agenda'],
          }),
      ).to.throw(/is not part of the `views` prop/i);
    });
  });

  describe('Method: setViewDefinition', () => {
    it('should set definition and cleanup to null', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS);

      const siblingVisibleDateGetter = vi.fn(
        ({ state }: { state: EventCalendarState }) => state.visibleDate,
      );
      const cleanup = store.setViewDefinition({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });

      expect(store.state.viewDefinition?.siblingVisibleDateGetter).to.equal(
        siblingVisibleDateGetter,
      );

      cleanup();

      expect(store.state.viewDefinition).to.equal(null);
    });
  });
});
