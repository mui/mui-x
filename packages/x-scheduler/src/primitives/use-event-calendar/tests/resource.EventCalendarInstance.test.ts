import { spy } from 'sinon';
import { CalendarResourceId } from '@mui/x-scheduler/primitives/models';
import { EventCalendarInstance } from '../EventCalendarInstance';
import { getAdapter } from './../../utils/adapter/getAdapter';

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
