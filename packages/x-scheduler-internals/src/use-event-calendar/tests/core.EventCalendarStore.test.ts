import { adapter, ResourceBuilder } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { spy } from 'sinon';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import {
  DEFAULT_PREFERENCES_MENU_CONFIG,
  DEFAULT_VIEW,
  DEFAULT_VIEWS,
  EventCalendarStore,
} from '../EventCalendarStore';
import type { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

describe('Core - EventCalendarStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        areEventsDraggable: true,
        areEventsResizable: true,
        canDragEventsFromTheOutside: false,
        canDropEventsToTheOutside: false,
        copiedEvent: null,
        selection: null,
        eventColor: 'teal',
        eventCreation: true,
        eventIdList: [],
        eventModelList: [],
        eventModelLookup: new Map(),
        eventModelStructure: undefined,
        displayTimezone: 'default',
        editingOccurrence: null,
        nowUpdatedEveryMinute: adapter.now('default'),
        occurrencePlaceholder: null,
        pendingRecurringEventOperation: null,
        preferences: EMPTY_OBJECT,
        preferencesMenuConfig: DEFAULT_PREFERENCES_MENU_CONFIG,
        processedEventLookup: new Map(),
        processedResourceLookup: new Map(),
        readOnly: false,
        recurringEventsPlugin: null,
        shouldEventRequireResource: false,
        resourceChildrenIdLookup: new Map(),
        resourceIdList: [],
        resourceModelStructure: undefined,
        showCurrentTimeIndicator: true,
        view: DEFAULT_VIEW,
        viewConfig: {},
        viewDefinition: null,
        views: DEFAULT_VIEWS,
        visibleDate: adapter.startOfDay(adapter.now('default')),
        visibleResources: {},
        collapsedResources: {},
        isLoading: false,
        errors: [],
      };

      expect(store.state).to.deep.equal(expectedState);
    });

    it('should default `shouldEventRequireResource` to `false`', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      expect(store.state.shouldEventRequireResource).to.equal(false);
    });

    it('should respect an explicit `shouldEventRequireResource={true}`', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          shouldEventRequireResource: true,
          resources: [ResourceBuilder.new().build()],
        },
        adapter,
      );
      expect(store.state.shouldEventRequireResource).to.equal(true);
    });

    it('should warn in dev when `shouldEventRequireResource` is `true` but no resources are configured', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventCalendarStore(
          { ...DEFAULT_PARAMS, shouldEventRequireResource: true, resources: [] },
          adapter,
        );
      }).toWarnDev([
        'MUI X Scheduler: `shouldEventRequireResource` is `true` but no resources are configured.',
      ]);
    });
  });

  describe('editing state machine', () => {
    // The editing methods only read `occurrence.key` / `displayTimezone`, so a minimal occurrence suffices.
    const occurrence = (id: string) => ({ id, key: id }) as any;

    describe('startEditing', () => {
      it('should record the occurrence in edit mode by default', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
        const edited = occurrence('event-1');

        store.startEditing(edited);

        expect(store.state.editingOccurrence).to.deep.equal({ occurrence: edited, mode: 'edit' });
      });

      it('should honor an explicit mode', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

        store.startEditing(occurrence('event-1'), 'armed');

        expect(store.state.editingOccurrence?.mode).to.equal('armed');
      });

      it('should call `onEventEditingStart` with the occurrence before recording the editing state', () => {
        const onEventEditingStart = spy();
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const edited = occurrence('event-1');

        store.startEditing(edited);

        expect(onEventEditingStart.calledOnce).to.equal(true);
        expect(onEventEditingStart.lastCall.firstArg).to.equal(edited);
        expect(onEventEditingStart.lastCall.args[1].reason).to.equal('edit');
        expect(store.state.editingOccurrence).to.deep.equal({ occurrence: edited, mode: 'edit' });
      });

      it('should not call `onEventEditingStart` when arming, then call it on the armed → edit transition', () => {
        const onEventEditingStart = spy();
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const edited = occurrence('event-1');

        store.startEditing(edited, 'armed');
        expect(onEventEditingStart.callCount).to.equal(0);

        store.setEditingMode('edit');
        expect(onEventEditingStart.calledOnce).to.equal(true);
        expect(onEventEditingStart.lastCall.firstArg).to.equal(edited);
      });

      it('should keep the occurrence armed when `onEventEditingStart` cancels the armed → edit transition', () => {
        const onEventEditingStart = spy((_occurrence, eventDetails) => eventDetails.cancel());
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const edited = occurrence('event-1');
        store.startEditing(edited, 'armed');

        store.setEditingMode('edit');

        expect(onEventEditingStart.calledOnce).to.equal(true);
        expect(store.state.editingOccurrence).to.deep.equal({ occurrence: edited, mode: 'armed' });
      });

      it('should not record the editing state when `onEventEditingStart` cancels', () => {
        const onEventEditingStart = spy((_occurrence, eventDetails) => eventDetails.cancel());
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);

        store.startEditing(occurrence('event-1'));

        expect(onEventEditingStart.calledOnce).to.equal(true);
        expect(store.state.editingOccurrence).to.equal(null);
      });

      it('should clear the creation placeholder when `onEventEditingStart` cancels a creation', () => {
        const onEventEditingStart = spy((_occurrence, eventDetails) => eventDetails.cancel());
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const placeholder = {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.date('2024-01-15T10:00:00', 'default'),
          end: adapter.date('2024-01-15T10:30:00', 'default'),
        } as any;
        store.setOccurrencePlaceholder(placeholder);

        store.startEditing(occurrence('event-1'));

        expect(onEventEditingStart.lastCall.args[1].reason).to.equal('creation');
        expect(store.state.editingOccurrence).to.equal(null);
        expect(store.state.occurrencePlaceholder).to.equal(null);
      });

      it('should forward the native event that initiated the creation placeholder', () => {
        const onEventEditingStart = spy();
        const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onEventEditingStart }, adapter);
        const nativeEvent = new Event('click');
        const placeholder = {
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.date('2024-01-15T10:00:00', 'default'),
          end: adapter.date('2024-01-15T10:30:00', 'default'),
        } as any;
        store.setOccurrencePlaceholder(placeholder, nativeEvent);

        store.startEditing(occurrence('event-1'));

        expect(onEventEditingStart.lastCall.args[1].event).to.equal(nativeEvent);
      });
    });

    describe('setEditingMode', () => {
      it('should swap the mode while keeping the same occurrence', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
        const edited = occurrence('event-1');
        store.startEditing(edited, 'armed');

        store.setEditingMode('edit');

        expect(store.state.editingOccurrence).to.deep.equal({ occurrence: edited, mode: 'edit' });
      });

      it('should be a no-op when nothing is being edited', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

        store.setEditingMode('edit');

        expect(store.state.editingOccurrence).to.equal(null);
      });

      it('should keep the same reference when the mode is unchanged', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
        store.startEditing(occurrence('event-1'), 'armed');
        const before = store.state.editingOccurrence;

        store.setEditingMode('armed');

        expect(store.state.editingOccurrence).to.equal(before);
      });
    });

    describe('setEditingOccurrenceTimes', () => {
      it('should refresh the edited occurrence times, keeping the mode', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
        store.startEditing(occurrence('event-1'), 'armed');
        const start = adapter.date('2024-01-15T10:00:00', 'default');
        const end = adapter.date('2024-01-15T11:30:00', 'default');

        store.setEditingOccurrenceTimes(start, end);

        const editing = store.state.editingOccurrence!;
        expect(editing.occurrence.displayTimezone.start.value).toEqualDateTime(start);
        expect(editing.occurrence.displayTimezone.end.value).toEqualDateTime(end);
        expect(editing.mode).to.equal('armed');
      });

      it('should be a no-op when nothing is being edited', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

        store.setEditingOccurrenceTimes(
          adapter.date('2024-01-15T10:00:00', 'default'),
          adapter.date('2024-01-15T11:30:00', 'default'),
        );

        expect(store.state.editingOccurrence).to.equal(null);
      });
    });

    describe('stopEditing', () => {
      it('should clear the editing state and any in-progress creation placeholder', () => {
        const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
        store.startEditing(occurrence('event-1'), 'edit');
        store.setOccurrencePlaceholder({
          type: 'creation',
          surfaceType: 'time-grid',
          start: adapter.date('2024-01-15T10:00:00', 'default'),
          end: adapter.date('2024-01-15T11:00:00', 'default'),
          resourceId: null,
        });

        store.stopEditing();

        expect(store.state.editingOccurrence).to.equal(null);
        expect(store.state.occurrencePlaceholder).to.equal(null);
      });
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

    it('should sync `shouldEventRequireResource` when parameters update', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);
      expect(store.state.shouldEventRequireResource).to.equal(false);

      store.updateStateFromParameters(
        {
          ...DEFAULT_PARAMS,
          shouldEventRequireResource: true,
          resources: [ResourceBuilder.new().build()],
        },
        adapter,
      );
      expect(store.state.shouldEventRequireResource).to.equal(true);
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
      }).toWarnDev(['MUI X Scheduler: A component is changing the default view state']);

      expect(store.state.view).to.equal(defaultView);
    });

    it('should keep consistent state when switching from uncontrolled → controlled `view` (warns in dev)', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      expect(() => {
        store.updateStateFromParameters({ ...DEFAULT_PARAMS, view: 'day' }, adapter);
      }).toWarnDev('MUI X Scheduler: A component is changing the uncontrolled view state');

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
      }).toWarnDev('MUI X Scheduler: A component is changing the controlled view state');

      expect(store.state.view).to.equal('day');
    });
  });
});
