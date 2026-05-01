import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
  getEventTimelinePremiumStateFromParameters,
} from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { schedulerOccurrenceSelectors } from './schedulerOccurrenceSelectors';

describe('schedulerOccurrenceSelectors', () => {
  describe('isStarted', () => {
    it('should return false when now is before start', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T08:00:00Z', 'default');

      const start = processDate(adapter.date('2025-07-03T10:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isStarted(state, start)).to.equal(false);
    });

    it('should return true when now is equal to start', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T10:00:00Z', 'default');

      const start = processDate(adapter.date('2025-07-03T10:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isStarted(state, start)).to.equal(true);
    });

    it('should return true when now is after start', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T10:30:00Z', 'default');

      const start = processDate(adapter.date('2025-07-03T10:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isStarted(state, start)).to.equal(true);
    });
  });

  describe('isEnded', () => {
    it('should return false when now is before end', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T10:30:00Z', 'default');

      const end = processDate(adapter.date('2025-07-03T11:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isEnded(state, end)).to.equal(false);
    });

    it('should return false when now is equal to end', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T11:00:00Z', 'default');

      const end = processDate(adapter.date('2025-07-03T11:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isEnded(state, end)).to.equal(false);
    });

    it('should return true when now is after end', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [] });
      state.nowUpdatedEveryMinute = adapter.date('2025-07-03T12:00:00Z', 'default');

      const end = processDate(adapter.date('2025-07-03T11:00:00Z', 'default'), adapter);

      expect(schedulerOccurrenceSelectors.isEnded(state, end)).to.equal(true);
    });
  });

  describe('groupedByResource', () => {
    const start = DEFAULT_TESTING_VISIBLE_DATE;
    const end = adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 2);

    it('should return empty when there are no resources', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [], resources: [] });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);
      expect(response).to.have.length(0);
    });

    it('should group single occurrence under a resource', () => {
      const resource = ResourceBuilder.new().build();

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [resource],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response).to.have.length(1);
      expect(response[0].resource.id).to.equal(resource.id);
      expect(response[0].occurrences).to.have.length(1);
      expect(response[0].occurrences[0].id).to.equal(event.id);
    });

    it('should return empty occurrences for resources without matching events', () => {
      const resource1 = ResourceBuilder.new().build();
      const resource2 = ResourceBuilder.new().build();

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource1)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [resource1, resource2],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      const group1 = response.find((item) => item.resource.id === resource1.id)!;
      const group2 = response.find((item) => item.resource.id === resource2.id)!;
      expect(group1.occurrences).to.have.length(1);
      expect(group2.occurrences).to.have.length(0);
    });

    it('should sort resources alphabetically by title', () => {
      const zoo = ResourceBuilder.new().title('Zoo').build();
      const alpha = ResourceBuilder.new().title('Alpha').build();
      const moon = ResourceBuilder.new().title('Moon').build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        resources: [zoo, moon, alpha],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((item) => item.resource.title)).to.deep.equal(['Alpha', 'Moon', 'Zoo']);
    });

    it('should group multiple occurrences under the same resource', () => {
      const resource = ResourceBuilder.new().build();

      const event1 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();
      const event2 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event1, event2],
        resources: [resource],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(2);
      expect(response[0].occurrences[0].id).to.equal(event1.id);
      expect(response[0].occurrences[1].id).to.equal(event2.id);
    });

    it('should ignore occurrences that have no resource id', () => {
      const resource = ResourceBuilder.new().build();

      const event1 = EventBuilder.new().singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR).build();
      const event2 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event1, event2],
        resources: [resource],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(1);
      expect(response[0].occurrences[0].id).to.equal(event2.id);
    });

    it('should include children immediately after their parent', () => {
      // Titles control alphabetical sort order within the parent
      const child1 = ResourceBuilder.new().title('A').build();
      const child2 = ResourceBuilder.new().title('B').build();
      const parent = ResourceBuilder.new()
        // intentionally unordered
        .children([child1, child2])
        .build();

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(child2)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [parent],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((item) => item.resource.id)).to.deep.equal([
        parent.id,
        child1.id,
        child2.id,
      ]);
      expect(response[2].occurrences).to.have.length(1);
      expect(response[2].occurrences[0].id).to.equal(event.id);
    });

    it('should not include a resource in the list when visibleResources marks it as false', () => {
      const resource = ResourceBuilder.new().build();

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(resource)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [resource],
      });
      // TODO: Use props.defaultVisibleResources when available
      state.visibleResources = { [resource.id]: false };
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response).to.have.length(0);
    });

    it('should handle deep nested resource trees', () => {
      const grandchild = ResourceBuilder.new().build();
      const child = ResourceBuilder.new().children([grandchild]).build();
      const parent = ResourceBuilder.new().children([child]).build();
      const root = ResourceBuilder.new().children([parent]).build();

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(grandchild)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [root],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((r) => r.resource.id)).to.deep.equal([
        root.id,
        parent.id,
        child.id,
        grandchild.id,
      ]);
      expect(response[3].occurrences[0].id).to.equal(event.id);
    });

    it('should leave occurrences empty when events fall outside the date range', () => {
      const resource = ResourceBuilder.new().build();

      const event = EventBuilder.new().singleDay('2024-03-01T09:00:00Z').resource(resource).build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [resource],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(0);
    });
  });
});
