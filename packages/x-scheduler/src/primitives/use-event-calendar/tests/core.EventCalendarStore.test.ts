import { getAdapter } from '../../utils/adapter/getAdapter';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_PREFERENCES_MENU_CONFIG,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  EventCalendarStore,
} from '../EventCalendarStore';
import { CalendarView } from '../../models';
import { DEFAULT_RESOURCES } from '../../utils/SchedulerStore';

const adapter = getAdapter();
const DEFAULT_PARAMS = { events: [] };

describe('Core - EventCalendarStore', () => {
  describe('create', () => {
    it('should initialize default state', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        view: DEFAULT_VIEW,
        views: DEFAULT_VIEWS,
        resources: DEFAULT_RESOURCES,
        events: [],
        visibleResources: new Map(),
        areEventsDraggable: false,
        areEventsResizable: false,
        ampm: true,
        showCurrentTimeIndicator: true,
        eventColor: 'jade',
        preferences: DEFAULT_PREFERENCES,
        preferencesMenuConfig: DEFAULT_PREFERENCES_MENU_CONFIG,
        viewConfig: null,
        occurrencePlaceholder: null,
        visibleDate: adapter.startOfDay(adapter.date()),
      };

      expect(store.state).to.deep.equal(expectedState);
    });
  });

  describe('updater', () => {
    it('should sync partial state from new parameters (views)', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const newParams = {
        events: DEFAULT_PARAMS.events,
        views: ['day', 'week'] as CalendarView[],
      };

      store.updateStateFromParameters(newParams, adapter);
      expect(store.state.views).to.deep.equal(['day', 'week']);
    });

    it('should respect controlled `view` (updates to new value)', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'month' }, adapter);

      expect(store.state.view).to.equal('month');
    });

    it('should not change `view` if not included in new parameters', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'month' }, adapter);

      store.updateStateFromParameters(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
          view: store.state.view,
        },
        adapter,
      );

      expect(store.state.view).to.equal('month');
    });

    it('should keep initial defaults and warns if default props change after mount', () => {
      const defaultView = 'month';
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView }, adapter);

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', name: 'Resource 1' }],
            defaultView: 'day',
          },
          adapter,
        );
      }).toWarnDev(['Scheduler: A component is changing the default view state']);

      expect(store.state.view).to.equal(defaultView);
    });

    it('should keep consistent state when switching from uncontrolled → controlled `view` (warns in dev)', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      expect(() => {
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'day' }, adapter);
      }).toWarnDev('Scheduler: A component is changing the uncontrolled view state');

      expect(store.state.view).to.equal('day');
    });

    it('should warn and keep current value when switching from controlled → uncontrolled `view`', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', name: 'Resource 1' }],
          },
          adapter,
        );
      }).toWarnDev('Scheduler: A component is changing the controlled view state');

      expect(store.state.view).to.equal('day');
    });
  });
});
