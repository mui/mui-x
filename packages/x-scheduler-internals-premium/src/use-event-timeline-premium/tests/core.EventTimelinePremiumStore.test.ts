import { adapter, ResourceBuilder } from 'test/utils/scheduler';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { schedulerRecurringEventsPlugin } from '../../internals/plugins/schedulerRecurringEventsPlugin';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const TEST_RESOURCE = ResourceBuilder.new().id('r1').title('Resource 1').build();
const DEFAULT_PARAMS = { events: [], resources: [TEST_RESOURCE] };

describe('Core - EventTimelinePremiumStore', () => {
  describe('create', () => {
    createRenderer({ clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743) });

    it('should initialize default state', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);

      const expectedState = {
        adapter,
        areEventsDraggable: true,
        areEventsResizable: true,
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
        editedEventId: null,
        nowUpdatedEveryMinute: adapter.now('default'),
        occurrencePlaceholder: null,
        pendingUpdateRecurringEventParameters: null,
        preferences: EMPTY_OBJECT,
        processedEventLookup: new Map(),
        processedResourceLookup: new Map([
          [
            TEST_RESOURCE.id,
            {
              id: TEST_RESOURCE.id,
              title: TEST_RESOURCE.title,
              areEventsDraggable: undefined,
              areEventsReadOnly: undefined,
              areEventsResizable: undefined,
              eventColor: undefined,
            },
          ],
        ]),
        readOnly: false,
        recurringEventsPlugin: schedulerRecurringEventsPlugin,
        shouldEventRequireResource: true,
        resourceChildrenIdLookup: new Map(),
        resourceIdList: [TEST_RESOURCE.id],
        resourceModelStructure: undefined,
        showCurrentTimeIndicator: true,
        preset: 'dayAndHour',
        presets: ['dayAndHour', 'dayAndMonth', 'dayAndWeek', 'monthAndYear', 'year'],
        visibleDate: adapter.startOfDay(adapter.now('default')),
        visibleResources: {},
        isLoading: false,
        errors: [],
        hasInitialized: false,
      };

      expect(store.state).to.deep.equal(expectedState);
    });

    it('should default `shouldEventRequireResource` to `true`', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);
      expect(store.state.shouldEventRequireResource).to.equal(true);
    });

    it('should respect an explicit `shouldEventRequireResource={false}`', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, shouldEventRequireResource: false },
        adapter,
      );
      expect(store.state.shouldEventRequireResource).to.equal(false);
    });

    it('should warn in dev when `shouldEventRequireResource` is `true` but no resources are configured', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore({ events: [], resources: [] }, adapter);
      }).toWarnDev([
        'MUI X Scheduler: `shouldEventRequireResource` is `true` but no resources are configured.',
      ]);
    });

    it('should sync `shouldEventRequireResource` when parameters update', () => {
      const store = new EventTimelinePremiumStore(DEFAULT_PARAMS, adapter);
      expect(store.state.shouldEventRequireResource).to.equal(true);

      store.updateStateFromParameters(
        { ...DEFAULT_PARAMS, shouldEventRequireResource: false },
        adapter,
      );
      expect(store.state.shouldEventRequireResource).to.equal(false);
    });

    it('should sort the presets array into the canonical zoom order regardless of input order', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, presets: ['year', 'dayAndHour', 'monthAndYear'] },
        adapter,
      );

      expect(store.state.presets).to.deep.equal(['dayAndHour', 'monthAndYear', 'year']);
    });

    it('should re-sort the presets array when parameters update', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, presets: ['dayAndHour', 'dayAndMonth'] },
        adapter,
      );

      store.updateStateFromParameters(
        { ...DEFAULT_PARAMS, presets: ['year', 'dayAndMonth', 'dayAndHour'] },
        adapter,
      );

      expect(store.state.presets).to.deep.equal(['dayAndHour', 'dayAndMonth', 'year']);
    });

    it('should dedupe the presets array', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, presets: ['dayAndMonth', 'dayAndMonth', 'dayAndHour', 'dayAndMonth'] },
        adapter,
      );

      expect(store.state.presets).to.deep.equal(['dayAndHour', 'dayAndMonth']);
    });

    it('should throw when the presets array is empty', () => {
      expect(
        () => new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, presets: [] }, adapter),
      ).to.throw(/empty `presets` prop/i);
    });

    it('should throw when the presets array contains unknown values', () => {
      expect(
        () =>
          new EventTimelinePremiumStore(
            {
              ...DEFAULT_PARAMS,
              presets: ['dayAndHour', 'notAPreset' as any, 'dayAndMonth'],
            },
            adapter,
          ),
      ).to.throw(/unknown preset\(s\)/i);
    });

    it('should throw at init when the initial preset is not included in the presets array', () => {
      expect(
        () =>
          new EventTimelinePremiumStore(
            { ...DEFAULT_PARAMS, preset: 'year', presets: ['dayAndHour', 'dayAndMonth'] },
            adapter,
          ),
      ).to.throw(/is not part of the `presets` prop/i);
    });

    it('should throw via the subscribe listener when a later state mutation makes the current preset fall out of the presets array', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, defaultPreset: 'dayAndMonth', presets: ['dayAndHour', 'dayAndMonth'] },
        adapter,
      );

      expect(() =>
        store.updateStateFromParameters(
          { ...DEFAULT_PARAMS, defaultPreset: 'dayAndMonth', presets: ['dayAndHour'] },
          adapter,
        ),
      ).to.throw(/is not part of the `presets` prop/i);

      // Dispose the store's pending timers; otherwise the `nowUpdatedEveryMinute` interval
      // would fire later, re-trigger the subscribe listener against the intentionally invalid
      // state left by this test, and leak an unhandled error into the test run.
      store.disposeEffect()();
    });
  });
});
