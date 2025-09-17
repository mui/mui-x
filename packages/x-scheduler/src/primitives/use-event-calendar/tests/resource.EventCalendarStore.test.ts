import { spy } from 'sinon';
import { CalendarResourceId } from '@mui/x-scheduler/primitives/models';
import { EventCalendarStore } from '../EventCalendarStore';
import { getAdapter } from '../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

describe('Resource - EventCalendarStore', () => {
  describe('Method: setVisibleResources', () => {
    it('should set only when reference changes', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);

      const resourcesMap = new Map<CalendarResourceId, boolean>([['r1', true]]);
      store.setVisibleResources(resourcesMap);
      expect(store.state.visibleResources).to.equal(resourcesMap);

      const setSpy = spy(store, 'set');
      store.setVisibleResources(resourcesMap);
      expect(setSpy.called).to.equal(false);
    });
  });
});
