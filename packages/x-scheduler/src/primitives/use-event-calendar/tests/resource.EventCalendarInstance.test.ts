import { spy } from 'sinon';
import { getAdapter } from '@mui/x-scheduler/primitives/utils/adapter/getAdapter';
import { CalendarResourceId } from '@mui/x-scheduler/primitives/models';
import { EventCalendarInstance } from '@mui/x-scheduler/primitives/use-event-calendar/EventCalendarInstance';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Resource - EventCalendarInstance', () => {
  describe('Method: setVisibleResources', () => {
    it('should set only when reference changes', () => {
      const { instance, store } = EventCalendarInstance.create(DEFAULT_PARAMS, adapter);

      const resourcesMap = new Map<CalendarResourceId, boolean>([['r1', true]]);
      instance.setVisibleResources(resourcesMap);
      expect(store.state.visibleResources).to.equal(resourcesMap);

      const setSpy = spy(store, 'set');
      instance.setVisibleResources(resourcesMap);
      expect(setSpy.called).to.equal(false);
    });
  });
});
