import { spy } from 'sinon';
import { CalendarResourceId } from '@mui/x-scheduler/primitives/models';
import { getAdapter } from '../../adapter/getAdapter';
import { storeClasses } from './utils';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

storeClasses.forEach((storeClass) => {
  describe(`Resource - ${storeClass.name}`, () => {
    describe('Method: setVisibleResources', () => {
      it('should set only when reference changes', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        const resourcesMap = new Map<CalendarResourceId, boolean>([['r1', true]]);
        store.setVisibleResources(resourcesMap);
        expect(store.state.visibleResources).to.equal(resourcesMap);

        const setSpy = spy(store, 'set');
        store.setVisibleResources(resourcesMap);
        expect(setSpy.called).to.equal(false);
      });
    });
  });
});
