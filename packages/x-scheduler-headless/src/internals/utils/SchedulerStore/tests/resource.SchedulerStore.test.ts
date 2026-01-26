import { spy } from 'sinon';
import {
  SchedulerResourceId,
  SchedulerResourceModelStructure,
} from '@mui/x-scheduler-headless/models';
import { adapter } from 'test/utils/scheduler';
import { storeClasses } from './utils';
import { schedulerResourceSelectors } from '../../../../scheduler-selectors';

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
        const resource = schedulerResourceSelectors.processedResource(store.state, '1');

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

    describe('prop: defaultVisibleResources', () => {
      it('should use the provided defaultVisibleResources on mount', () => {
        const defaultVisibleResources: Record<SchedulerResourceId, boolean> = { r1: false };
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, defaultVisibleResources }, adapter);

        expect(store.state.visibleResources).to.equal(defaultVisibleResources);
      });

      it('should use an empty object when defaultVisibleResources is not provided', () => {
        const store = new storeClass.Value(DEFAULT_PARAMS, adapter);

        expect(Object.keys(store.state.visibleResources).length).to.equal(0);
      });
    });

    describe('prop: visibleResources (controlled)', () => {
      it('should use the provided visibleResources on mount', () => {
        const visibleResources: Record<SchedulerResourceId, boolean> = { r1: false };
        const store = new storeClass.Value({ ...DEFAULT_PARAMS, visibleResources }, adapter);

        expect(store.state.visibleResources).to.equal(visibleResources);
      });

      it('should prefer visibleResources over defaultVisibleResources', () => {
        const visibleResources: Record<SchedulerResourceId, boolean> = { r1: false };
        const defaultVisibleResources: Record<SchedulerResourceId, boolean> = { r2: false };
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleResources, defaultVisibleResources },
          adapter,
        );

        expect(store.state.visibleResources).to.equal(visibleResources);
      });

      it('should update visibleResources when controlled prop changes', () => {
        const visibleResources1: Record<SchedulerResourceId, boolean> = { r1: false };
        const visibleResources2: Record<SchedulerResourceId, boolean> = { r2: false };

        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, visibleResources: visibleResources1 },
          adapter,
        );
        expect(store.state.visibleResources).to.equal(visibleResources1);

        store.updateStateFromParameters(
          { ...DEFAULT_PARAMS, visibleResources: visibleResources2 },
          adapter,
        );
        expect(store.state.visibleResources).to.equal(visibleResources2);
      });
    });

    describe('Method: setVisibleResources', () => {
      it('should update visibleResources and call onVisibleResourcesChange when is uncontrolled', () => {
        const onVisibleResourcesChange = spy();
        const store = new storeClass.Value(
          { ...DEFAULT_PARAMS, onVisibleResourcesChange },
          adapter,
        );

        const newVisibleResources: Record<SchedulerResourceId, boolean> = { r1: false };
        store.setVisibleResources(newVisibleResources, new Event('click'));

        expect(store.state.visibleResources).to.equal(newVisibleResources);
        expect(onVisibleResourcesChange.calledOnce).to.equal(true);
        expect(onVisibleResourcesChange.lastCall.firstArg).to.equal(newVisibleResources);
      });

      it('should not change the state but call onVisibleResourcesChange when is controlled', () => {
        const onVisibleResourcesChange = spy();
        const controlledVisibleResources: Record<SchedulerResourceId, boolean> = { r1: true };

        const store = new storeClass.Value(
          {
            ...DEFAULT_PARAMS,
            visibleResources: controlledVisibleResources,
            onVisibleResourcesChange,
          },
          adapter,
        );

        const newVisibleResources: Record<SchedulerResourceId, boolean> = { r2: false };
        store.setVisibleResources(newVisibleResources, new Event('click'));

        expect(store.state.visibleResources).to.equal(controlledVisibleResources);
        expect(onVisibleResourcesChange.calledOnce).to.equal(true);
        expect(onVisibleResourcesChange.lastCall.firstArg).to.equal(newVisibleResources);
      });

      it('should do nothing if visibleResources is the same reference (no state change, no callback)', () => {
        const onVisibleResourcesChange = spy();
        const visibleResources: Record<SchedulerResourceId, boolean> = { r1: false };

        const store = new storeClass.Value(
          {
            ...DEFAULT_PARAMS,
            defaultVisibleResources: visibleResources,
            onVisibleResourcesChange,
          },
          adapter,
        );

        store.setVisibleResources(visibleResources, new Event('click'));

        expect(store.state.visibleResources).to.equal(visibleResources);
        expect(onVisibleResourcesChange.called).to.equal(false);
      });
    });
  });
});
