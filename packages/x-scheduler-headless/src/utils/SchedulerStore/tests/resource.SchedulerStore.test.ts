import { spy } from 'sinon';
import {
  CalendarResourceId,
  SchedulerResourceModelStructure,
} from '@mui/x-scheduler-headless/models';
import { adapter } from 'test/utils/scheduler';
import { storeClasses } from './utils';
import { selectors } from '../SchedulerStore.selectors';

const DEFAULT_PARAMS = { events: [] };

storeClasses.forEach((storeClass) => {
  describe(`Resource - ${storeClass.name}`, () => {
    describe('prop: resourceModelStructure', () => {
      interface MyResource {
        myId: string;
        myTitle: string;
      }

      const resourceModelStructure: SchedulerResourceModelStructure<MyResource> = {
        id: {
          getter: (event) => event.myId,
        },
        title: {
          getter: (event) => event.myTitle,
        },
      };

      it('should use the provided event model structure to read event properties', () => {
        const resources: MyResource[] = [
          {
            myId: '1',
            myTitle: 'Resource 1',
          },
        ];

        const store = new storeClass.Value(
          { events: [], resources, resourceModelStructure },
          adapter,
        );
        const resource = selectors.resource(store.state, '1');

        expect(resource).to.deep.contain({
          id: '1',
          title: 'Resource 1',
        });
      });

      it('should only re-compute the processed resources when updating resources or resourceModelStructure parameters', () => {
        interface MyResource2 {
          myId: string;
          title: string;
        }

        const idGetter = spy((event: MyResource2) => event.myId);

        const resourceModelStructure2: SchedulerResourceModelStructure<MyResource2> = {
          id: {
            getter: idGetter,
          },
        };

        const resources: MyResource2[] = [
          {
            myId: '1',
            title: 'Resource 1',
          },
        ];

        const store = new storeClass.Value(
          {
            events: [],
            resources,
            resourceModelStructure: resourceModelStructure2,
            showCurrentTimeIndicator: false,
          },
          adapter,
        );

        // Called to convert Resource 1 on mount.
        expect(idGetter.callCount).to.equal(1);

        store.updateStateFromParameters(
          {
            events: [],
            resources,
            resourceModelStructure: resourceModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Not called again when updating a non-related parameter.
        expect(idGetter.callCount).to.equal(1);

        const resources2: MyResource2[] = [
          {
            myId: '1',
            title: 'Resource 1',
          },
          {
            myId: '2',
            title: 'Resource 2',
          },
        ];

        store.updateStateFromParameters(
          {
            events: [],
            resources: resources2,
            resourceModelStructure: resourceModelStructure2,
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Called again to convert Resource 1 and Resource 2 because props.events changed.
        expect(idGetter.callCount).to.equal(3);

        store.updateStateFromParameters(
          {
            events: [],
            resources: resources2,
            resourceModelStructure: { ...resourceModelStructure2 },
            showCurrentTimeIndicator: true,
          },
          adapter,
        );

        // Called again to convert Resource 1 and Resource 2 because props.resourceModelStructure changed.
        expect(idGetter.callCount).to.equal(5);
      });
    });

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
