import { adapter } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import {
  DEFAULT_PREFERENCES_MENU_CONFIG,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  EventCalendarStore,
} from '../EventCalendarStore';
import { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

describe('Core - EventCalendarStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        areEventsDraggable: false,
        areEventsResizable: false,
        canDragEventsFromTheOutside: false,
        canDropEventsToTheOutside: false,
        copiedEvent: null,
        eventColor: 'teal',
        eventCreation: true,
        eventIdList: [],
        eventModelList: [],
        eventModelLookup: new Map(),
        eventModelStructure: undefined,
        displayTimezone: 'default',
        nowUpdatedEveryMinute: adapter.now('default'),
        occurrencePlaceholder: null,
        pendingUpdateRecurringEventParameters: null,
        plan: 'community',
        preferences: EMPTY_OBJECT,
        preferencesMenuConfig: DEFAULT_PREFERENCES_MENU_CONFIG,
        processedEventLookup: new Map(),
        processedResourceLookup: new Map(),
        readOnly: false,
        resourceChildrenIdLookup: new Map(),
        resourceIdList: [],
        resourceModelStructure: undefined,
        showCurrentTimeIndicator: true,
        view: DEFAULT_VIEW,
        viewConfig: null,
        views: DEFAULT_VIEWS,
        visibleDate: adapter.startOfDay(adapter.now('default')),
        visibleResources: {},
        isLoading: false,
        errors: [],
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
          resources: [{ id: 'r1', title: 'Resource 1' }],
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
            resources: [{ id: 'r1', title: 'Resource 1' }],
            defaultView: 'day',
          },
          adapter,
        );
      }).toWarnDev(['MUI: A component is changing the default view state']);

      expect(store.state.view).to.equal(defaultView);
    });

    it('should keep consistent state when switching from uncontrolled → controlled `view` (warns in dev)', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      expect(() => {
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'day' }, adapter);
      }).toWarnDev('MUI: A component is changing the uncontrolled view state');

      expect(store.state.view).to.equal('day');
    });

    it('should warn and keep current value when switching from controlled → uncontrolled `view`', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', title: 'Resource 1' }],
          },
          adapter,
        );
      }).toWarnDev('MUI: A component is changing the controlled view state');

      expect(store.state.view).to.equal('day');
    });
  });
});
