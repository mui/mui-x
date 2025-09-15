import { spy } from 'sinon';
import { CalendarResourceId } from '@mui/x-scheduler/primitives/models';
import { EventCalendarStore } from '../EventCalendarStore';
import { getAdapter } from './../../utils/adapter/getAdapter';

const DEFAULT_PARAMS = { events: [] };

const adapter = getAdapter();

const SAMPLE_RESOURCES = [
  { id: '1', name: 'Sport' },
  { id: '2', name: 'Work' },
  { id: '3', name: 'Personal' },
];

describe('Visible Resources - EventCalendarStore', () => {
  describe('Controlled mode', () => {
    it('should initialize with controlled visible resources', () => {
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        visibleResources: ['1', '3'], // Only Sport and Personal visible
      }, adapter);

      // Resource '2' (Work) should be marked as hidden
      expect(store.state.visibleResources.get('2')).to.equal(false);
      // Resources '1' and '3' should not be in the map (visible by default)
      expect(store.state.visibleResources.has('1')).to.equal(false);
      expect(store.state.visibleResources.has('3')).to.equal(false);
    });

    it('should call onVisibleResourcesChange when controlled visible resources change', () => {
      const onVisibleResourcesChange = spy();
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        visibleResources: ['1', '2', '3'],
        onVisibleResourcesChange,
      }, adapter);

      const newVisibleResourcesMap = new Map<CalendarResourceId, boolean>([['2', false]]);
      store.setVisibleResources(newVisibleResourcesMap);

      // Should call the callback with the new visible resources array
      expect(onVisibleResourcesChange.calledWith(['1', '3'])).to.equal(true);
    });

    it('should not update state when controlled prop is provided', () => {
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        visibleResources: ['1', '2'],
      }, adapter);

      const setSpy = spy(store, 'set');
      const newVisibleResourcesMap = new Map<CalendarResourceId, boolean>([['3', false]]);
      
      store.setVisibleResources(newVisibleResourcesMap);

      // Should not call set because it's controlled
      expect(setSpy.called).to.equal(false);
    });
  });

  describe('Uncontrolled mode', () => {
    it('should initialize with default visible resources', () => {
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        defaultVisibleResources: ['1'], // Only Sport visible initially
      }, adapter);

      // Resources '2' and '3' should be marked as hidden
      expect(store.state.visibleResources.get('2')).to.equal(false);
      expect(store.state.visibleResources.get('3')).to.equal(false);
      // Resource '1' should not be in the map (visible by default)
      expect(store.state.visibleResources.has('1')).to.equal(false);
    });

    it('should initialize with all resources visible when no default is provided', () => {
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
      }, adapter);

      // All resources should be visible (empty map)
      expect(store.state.visibleResources.size).to.equal(0);
    });

    it('should update state and call callback in uncontrolled mode', () => {
      const onVisibleResourcesChange = spy();
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        defaultVisibleResources: ['1', '2', '3'],
        onVisibleResourcesChange,
      }, adapter);

      const newVisibleResourcesMap = new Map<CalendarResourceId, boolean>([['2', false]]);
      store.setVisibleResources(newVisibleResourcesMap);

      // Should update the state
      expect(store.state.visibleResources).to.equal(newVisibleResourcesMap);
      // Should call the callback
      expect(onVisibleResourcesChange.calledWith(['1', '3'])).to.equal(true);
    });
  });

  describe('Helper methods', () => {
    it('should convert visible resources array to map correctly', () => {
      const store = EventCalendarStore.create({
        ...DEFAULT_PARAMS,
        resources: SAMPLE_RESOURCES,
        visibleResources: ['1', '3'],
      }, adapter);

      // Check that the conversion worked correctly
      expect(store.state.visibleResources.has('1')).to.equal(false); // visible (not in map)
      expect(store.state.visibleResources.get('2')).to.equal(false); // hidden
      expect(store.state.visibleResources.has('3')).to.equal(false); // visible (not in map)
    });
  });
});