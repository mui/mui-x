import { getAdapter } from '../../utils/adapter/getAdapter';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_PREFERENCES_MENU_CONFIG,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  DEFAULT_RESOURCES,
  EventCalendarStore,
} from '../EventCalendarStore';
import { buildEvent, getIds } from './utils';
import { CalendarView } from '../../models';

const adapter = getAdapter();
const DEFAULT_PARAMS = { events: [] };

describe('Core - EventCalendarStore', () => {
  describe('create', () => {
    it('should initialize default state', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);

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
        visibleDate: adapter.startOfDay(adapter.date()),
      };

      expect(store.state).to.deep.equal(expectedState);
    });

    it('should keep provided events array', () => {
      const events = [
        buildEvent(
          '1',
          'Event 1',
          adapter.date('2025-08-01T08:00:00Z'),
          adapter.date('2025-08-01T09:00:00Z'),
        ),
        buildEvent(
          '2',
          'Event 2',
          adapter.date('2025-09-01T08:00:00Z'),
          adapter.date('2025-09-01T09:00:00Z'),
        ),
      ];

      const store = EventCalendarStore.create({ events }, adapter);

      expect(store.state.events).to.have.length(2);
      expect(store.state.events[0].title).to.equal('Event 1');
      expect(store.state.events[1].title).to.equal('Event 2');
      expect(store.state.events).to.equal(events);
    });
  });

  describe('updater', () => {
    it('should sync partial state from new parameters (events/resources/views/flags/ampm/indicator)', () => {
      const store = EventCalendarStore.create(DEFAULT_PARAMS, adapter);

      const newParams = {
        events: [
          buildEvent(
            '1',
            'Test Event',
            adapter.date('2025-07-01T10:00:00Z'),
            adapter.date('2025-07-01T11:00:00Z'),
          ),
        ],
        resources: [
          { id: 'r1', name: 'Resource 1' },
          { id: 'r2', name: 'Resource 2' },
        ],
        views: ['day', 'week'] as CalendarView[],
        areEventsDraggable: true,
        areEventsResizable: true,
        ampm: false,
        showCurrentTimeIndicator: false,
      };

      store.updateStateFromParameters(newParams, adapter);
      expect(getIds(store.state.events)).to.deep.equal(['1']);
      expect(getIds(store.state.resources)).to.deep.equal(['r1', 'r2']);
      expect(store.state.views).to.deep.equal(['day', 'week']);
      expect(store.state.areEventsDraggable).to.equal(true);
      expect(store.state.areEventsResizable).to.equal(true);
      expect(store.state.ampm).to.equal(false);
      expect(store.state.showCurrentTimeIndicator).to.equal(false);
    });

    it('should respect controlled `view` (updates to new value)', () => {
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'month' }, adapter);

      expect(store.state.view).to.equal('month');
    });

    it('should respect controlled `visibleDate` (updates to new value)', () => {
      const initial = adapter.date('2025-07-05T00:00:00Z');
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, visibleDate: initial }, adapter);

      const next = adapter.date('2025-07-10T00:00:00Z');
      store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: next }, adapter);

      expect(store.state.visibleDate).toEqualDateTime(next);
    });

    it('should not change `view` if not included in new parameters', () => {
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, view: 'month' }, adapter);

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

    it('should not change `visibleDate` if not included in new parameters', () => {
      const initialVisibleDate = adapter.date('2025-07-01T00:00:00Z');
      const store = EventCalendarStore.create(
        { ...DEFAULT_PARAMS, visibleDate: initialVisibleDate },
        adapter,
      );

      store.updateStateFromParameters(
        {
          ...DEFAULT_PARAMS,
          resources: [{ id: 'r1', name: 'Resource 1' }],
          visibleDate: store.state.visibleDate,
        },
        adapter,
      );

      expect(store.state.visibleDate).toEqualDateTime(initialVisibleDate);
    });

    it('should keep initial defaults and warns if default props change after mount', () => {
      const defaultDate = adapter.date('2025-07-15T00:00:00Z');
      const defaultView = 'month';

      const store = EventCalendarStore.create(
        { ...DEFAULT_PARAMS, defaultView, defaultVisibleDate: defaultDate },
        adapter,
      );

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', name: 'Resource 1' }],
            defaultView: 'day',
            defaultVisibleDate: adapter.date('2025-12-30T00:00:00Z'),
          },
          adapter,
        );
      }).toWarnDev([
        'Base UI: Event Calendar: A component is changing the default view state',
        'Base UI: Event Calendar: A component is changing the default visibleDate state',
      ]);

      expect(store.state.view).to.equal(defaultView);
      expect(store.state.visibleDate).toEqualDateTime(defaultDate);
    });

    it('should keep consistent state when switching from uncontrolled → controlled `view` (warns in dev)', () => {
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      expect(() => {
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'day' }, adapter);
      }).toWarnDev('Base UI: Event Calendar: A component is changing the uncontrolled view state');

      expect(store.state.view).to.equal('day');
    });

    it('should keep consistent state when switching from uncontrolled → controlled `visible date` (warns in dev)', () => {
      const store = EventCalendarStore.create(
        { ...DEFAULT_PARAMS, defaultVisibleDate: adapter.date('2025-07-05T00:00:00Z') },
        adapter,
      );

      const newDate = adapter.date('2025-07-10T00:00:00Z');
      expect(() => {
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, visibleDate: newDate }, adapter);
      }).toWarnDev(
        'Base UI: Event Calendar: A component is changing the uncontrolled visibleDate state',
      );

      expect(store.state.visibleDate).toEqualDateTime(newDate);
    });

    it('should warn and keep current value when switching from controlled → uncontrolled `view`', () => {
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, view: 'day' }, adapter);

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', name: 'Resource 1' }],
          },
          adapter,
        );
      }).toWarnDev('Base UI: Event Calendar: A component is changing the controlled view state');

      expect(store.state.view).to.equal('day');
    });

    it('should warn and keep current value when switching from controlled → uncontrolled `visibleDate`', () => {
      const initial = adapter.date('2025-07-05T00:00:00Z');
      const store = EventCalendarStore.create({ ...DEFAULT_PARAMS, visibleDate: initial }, adapter);

      expect(() => {
        store.updateStateFromParameters(
          {
            ...DEFAULT_PARAMS,
            resources: [{ id: 'r1', name: 'Resource 1' }],
          },
          adapter,
        );
      }).toWarnDev(
        'Base UI: Event Calendar: A component is changing the controlled visibleDate state',
      );

      expect(store.state.visibleDate).toEqualDateTime(initial);
    });
  });
});
