import { spy } from 'sinon';
import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models/date';
import { EventCalendarInstance } from '../EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('View - EventCalendarInstance', () => {
  describe('Method: setView', () => {
    it('should update view and call onViewChange when value changes and is uncontrolled', () => {
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

    it('should NOT mutate store but calls onViewChange when is controlled', () => {
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

    it('should do nothing if setting the same view: no state change, no callback', () => {
      const onViewChange = spy();
      const { instance, store } = EventCalendarInstance.create(
        { ...DEFAULT_PARAMS, defaultView: 'month', onViewChange },
        adapter,
      );

      instance.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.called).to.equal(false);
    });

    it('should throw when switching to a view not included in the allowed views', () => {
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
