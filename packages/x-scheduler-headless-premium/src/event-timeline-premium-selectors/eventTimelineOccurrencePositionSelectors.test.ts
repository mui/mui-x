import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../use-event-timeline-premium';
import { eventTimelineOccurrencePositionSelectors } from './eventTimelineOccurrencePositionSelectors';

describe('eventTimelineOccurrencePositionSelectors', () => {
  function createStore(parameters: {
    events?: ReturnType<EventBuilder['build']>[];
    resources?: ReturnType<ResourceBuilder['build']>[];
  }) {
    return new EventTimelinePremiumStore(
      {
        events: parameters.events ?? [],
        resources: parameters.resources,
        visibleDate: DEFAULT_TESTING_VISIBLE_DATE,
        preset: 'dayAndHour',
      },
      adapter,
    );
  }

  describe('memoization', () => {
    it('should return referentially-equal `positions` for two reads of the same state', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({ events: [event], resources: [resource] });

      const first = eventTimelineOccurrencePositionSelectors.positions(store.state);
      const second = eventTimelineOccurrencePositionSelectors.positions(store.state);
      expect(first).to.equal(second);
    });

    it('should return referentially-equal `visibleOccurrences` for two reads of the same state', () => {
      const resource = ResourceBuilder.new().build();
      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({ events: [event], resources: [resource] });

      const first = eventTimelineOccurrencePositionSelectors.visibleOccurrences(store.state);
      const second = eventTimelineOccurrencePositionSelectors.visibleOccurrences(store.state);
      expect(first).to.equal(second);
    });

    it('should return referentially-equal per-resource layouts for two reads of the same state', () => {
      const resource1 = ResourceBuilder.new().id('r1').build();
      const resource2 = ResourceBuilder.new().id('r2').build();
      const event1 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource1)
        .build();
      const event2 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource2)
        .build();
      const store = createStore({
        events: [event1, event2],
        resources: [resource1, resource2],
      });

      const layout1A = eventTimelineOccurrencePositionSelectors.layoutForResource(
        store.state,
        'r1',
      );
      const layout1B = eventTimelineOccurrencePositionSelectors.layoutForResource(
        store.state,
        'r1',
      );
      expect(layout1A).to.equal(layout1B);
    });
  });

  describe('null-handling on parametric selectors', () => {
    it('should return `null` from `layoutForResource(null)`', () => {
      const store = createStore({ events: [], resources: [] });
      const layout = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, null);
      expect(layout).to.equal(null);
    });

    it('should return `null` from `layoutForResource` for an unknown resource id', () => {
      const store = createStore({ events: [], resources: [] });
      const layout = eventTimelineOccurrencePositionSelectors.layoutForResource(
        store.state,
        'unknown-resource',
      );
      expect(layout).to.equal(null);
    });

    it('should return `null` from `positionByKey(null)`', () => {
      const store = createStore({ events: [], resources: [] });
      const position = eventTimelineOccurrencePositionSelectors.positionByKey(store.state, null);
      expect(position).to.equal(null);
    });

    it('should return `null` from `positionByKey` for an unknown occurrence key', () => {
      const store = createStore({ events: [], resources: [] });
      const position = eventTimelineOccurrencePositionSelectors.positionByKey(
        store.state,
        'unknown-key',
      );
      expect(position).to.equal(null);
    });

    it('should return `1` from `maxLaneForResource(null)`', () => {
      const store = createStore({ events: [], resources: [] });
      const maxLane = eventTimelineOccurrencePositionSelectors.maxLaneForResource(
        store.state,
        null,
      );
      expect(maxLane).to.equal(1);
    });

    it('should return `1` from `maxLaneForResource` for an unknown resource id', () => {
      const store = createStore({ events: [], resources: [] });
      const maxLane = eventTimelineOccurrencePositionSelectors.maxLaneForResource(
        store.state,
        'unknown-resource',
      );
      expect(maxLane).to.equal(1);
    });

    it('should return `null` from `occurrenceByKey` for an unknown occurrence key', () => {
      const store = createStore({ events: [], resources: [] });
      const occurrence = eventTimelineOccurrencePositionSelectors.occurrenceByKey(
        store.state,
        'unknown-key',
      );
      expect(occurrence).to.equal(null);
    });
  });

  describe('content', () => {
    it('should index occurrences by key and group keys by resource', () => {
      const resource = ResourceBuilder.new().id('r1').build();
      const event1 = EventBuilder.new()
        .id('A')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const event2 = EventBuilder.new()
        .id('B')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({
        events: [event1, event2],
        resources: [resource],
      });

      const occurrences = eventTimelineOccurrencePositionSelectors.visibleOccurrences(store.state);
      expect(occurrences.byKey.size).to.equal(2);

      const keys = occurrences.keysByResource.get('r1') ?? [];
      expect(keys).to.have.length(2);
    });

    it('should expose lane positions for a single-occurrence resource', () => {
      const resource = ResourceBuilder.new().id('r1').build();
      const event = EventBuilder.new()
        .id('A')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({ events: [event], resources: [resource] });

      const layout = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, 'r1');
      expect(layout).not.to.equal(null);
      expect(layout!.orderedKeys).to.have.length(1);
      expect(layout!.maxLane).to.equal(1);

      const occurrenceKey = layout!.orderedKeys[0];
      const position = layout!.positionByKey.get(occurrenceKey);
      expect(position).to.deep.equal({ firstLane: 1, lastLane: 1 });

      const maxLane = eventTimelineOccurrencePositionSelectors.maxLaneForResource(
        store.state,
        'r1',
      );
      expect(maxLane).to.equal(1);
    });

    it('should stack overlapping occurrences on different lanes within the same resource', () => {
      const resource = ResourceBuilder.new().id('r1').build();
      const event1 = EventBuilder.new()
        .id('A')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const event2 = EventBuilder.new()
        .id('B')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({
        events: [event1, event2],
        resources: [resource],
      });

      const layout = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, 'r1');
      expect(layout).not.to.equal(null);
      expect(layout!.maxLane).to.equal(2);

      const maxLane = eventTimelineOccurrencePositionSelectors.maxLaneForResource(
        store.state,
        'r1',
      );
      expect(maxLane).to.equal(2);
    });

    it('should keep resources independent: lane assignment does not bleed across resources', () => {
      const resource1 = ResourceBuilder.new().id('r1').build();
      const resource2 = ResourceBuilder.new().id('r2').build();
      const event1 = EventBuilder.new()
        .id('A')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource1)
        .build();
      const event2 = EventBuilder.new()
        .id('B')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource2)
        .build();
      const store = createStore({
        events: [event1, event2],
        resources: [resource1, resource2],
      });

      const layout1 = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, 'r1');
      const layout2 = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, 'r2');
      expect(layout1!.maxLane).to.equal(1);
      expect(layout2!.maxLane).to.equal(1);

      const positions = eventTimelineOccurrencePositionSelectors.positions(store.state);
      // Global maxLane is the max of all per-resource maxLanes.
      expect(positions.maxLane).to.equal(1);
    });

    it('should expose `occurrenceKeysForResource` returning the same keys as the layout', () => {
      const resource = ResourceBuilder.new().id('r1').build();
      const event = EventBuilder.new()
        .id('A')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const store = createStore({ events: [event], resources: [resource] });

      const keys = eventTimelineOccurrencePositionSelectors.occurrenceKeysForResource(
        store.state,
        'r1',
      );
      const layout = eventTimelineOccurrencePositionSelectors.layoutForResource(store.state, 'r1');
      expect(Array.from(keys)).to.deep.equal(Array.from(layout!.orderedKeys));
    });
  });
});
