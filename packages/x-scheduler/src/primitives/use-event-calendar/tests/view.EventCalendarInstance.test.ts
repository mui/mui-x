import { spy } from 'sinon';
import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models/date';
import { EventCalendarInstance } from '@mui/x-scheduler/primitives/use-event-calendar/EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('View - EventCalendarInstance', () => {
  describe('Method: setView', () => {
    it('uncontrolled: updates view and calls onViewChange when value changes', () => {
      const onViewChange = spy();
      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, onViewChange },
        adapter,
      );

      instance.setView('day', {} as any);

      expect(store.state.view).to.equal('day');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('controlled: does NOT mutate store but calls onViewChange', () => {
      const onViewChange = spy();
      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, view: 'week', onViewChange },
        adapter,
      );

      instance.setView('day', {} as any);

      expect(store.state.view).to.equal('week');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('no-op when setting the same view: no state change, no callback', () => {
      const onViewChange = spy();
      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, defaultView: 'month', onViewChange },
        adapter,
      );

      instance.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.called).to.equal(false);
    });

    it('throws when switching to a view not included in the allowed views', () => {
      const { instance } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, views: ['day', 'agenda'], defaultView: 'day' },
        adapter,
      );

      expect(() => instance.setView('week', {} as any)).to.throw(/not compatible/i);
    });
  });

  describe('Method: setViewConfig', () => {
    it('should set config and cleanup to null', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      const siblingVisibleDateGetter = spy((d: SchedulerValidDate) => d);
      const cleanup = instance.setViewConfig({ siblingVisibleDateGetter });

      expect(store.state.viewConfig?.siblingVisibleDateGetter).to.equal(siblingVisibleDateGetter);

      cleanup();

      expect(store.state.viewConfig).to.equal(null);
    });
  });
});
