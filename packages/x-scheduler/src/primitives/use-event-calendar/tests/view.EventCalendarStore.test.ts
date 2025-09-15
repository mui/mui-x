import { spy } from 'sinon';
import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models/date';
import { EventCalendarStore } from '../EventCalendarStore';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('View - EventCalendarStore', () => {
  describe('Method: setView', () => {
    it('should update view and call onViewChange when value changes and is uncontrolled', () => {
      const onViewChange = spy();
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, onViewChange }, adapter);

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('day');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should NOT mutate store but calls onViewChange when is controlled', () => {
      const onViewChange = spy();
      const store = EventCalendarStore.create(
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
      const store = EventCalendarStore.create(
        { ...DEFAULT_PARAMS, defaultView: 'month', onViewChange },
        adapter,
      );

      store.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.called).to.equal(false);
    });

    it('should throw when switching to a view not included in the allowed views', () => {
      const store = EventCalendarStore.create(
        { ...DEFAULT_PARAMS, views: ['day', 'agenda'], defaultView: 'day' },
        adapter,
      );

      expect(() => store.setView('week', {} as any)).to.throw(/not compatible/i);
    });
  });

  describe('Method: setViewConfig', () => {
    it('should set config and cleanup to null', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);

      const siblingVisibleDateGetter = spy((d: SchedulerValidDate) => d);
      const cleanup = store.setViewConfig({ siblingVisibleDateGetter });

      expect(store.state.viewConfig?.siblingVisibleDateGetter).to.equal(siblingVisibleDateGetter);

      cleanup();

      expect(store.state.viewConfig).to.equal(null);
    });
  });
});
