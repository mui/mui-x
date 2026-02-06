import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getEventTimelinePremiumStateFromParameters,
} from 'test/utils/scheduler';
import { SchedulerResource } from '../models';
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
    const makeResource = (
      id: string,
      title: string,
      children?: SchedulerResource[],
    ): SchedulerResource => ({
      id,
      title,
      children,
    });

    const start = DEFAULT_TESTING_VISIBLE_DATE;
    const end = adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 2);

    it('should return empty when there are no resources', () => {
      const state = getEventTimelinePremiumStateFromParameters({ events: [], resources: [] });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);
      expect(response).to.have.length(0);
    });

    it('should group single occurrence under a resource', () => {
      const R1 = makeResource('R1', 'Resource 1');

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [R1],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response).to.have.length(1);
      expect(response[0].resource.id).to.equal(R1.id);
      expect(response[0].occurrences).to.have.length(1);
      expect(response[0].occurrences[0].id).to.equal(event.id);
    });

    it('should return empty occurrences for resources without matching events', () => {
      const R1 = makeResource('R1', 'Resource 1');
      const R2 = makeResource('R2', 'Resource 2');

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [R1, R2],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(1);
      expect(response[1].occurrences).to.have.length(0);
    });

    it('should sort resources alphabetically by title', () => {
      const R1 = makeResource('Z', 'Zoo');
      const R2 = makeResource('A', 'Alpha');
      const R3 = makeResource('M', 'Moon');

      const state = getEventTimelinePremiumStateFromParameters({
        events: [],
        resources: [R1, R3, R2],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((item) => item.resource.title)).to.deep.equal(['Alpha', 'Moon', 'Zoo']);
    });

    it('should group multiple occurrences under the same resource', () => {
      const R1 = makeResource('R1', 'Alpha');

      const event1 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();
      const event2 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event1, event2],
        resources: [R1],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(2);
      expect(response[0].occurrences[0].id).to.equal(event1.id);
      expect(response[0].occurrences[1].id).to.equal(event2.id);
    });

    it('should ignore occurrences that have no resource id', () => {
      const R1 = makeResource('R1', 'Resource 1');

      const event1 = EventBuilder.new().singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR).build();
      const event2 = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event1, event2],
        resources: [R1],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(1);
      expect(response[0].occurrences[0].id).to.equal(event2.id);
    });

    it('should include children immediately after their parent', () => {
      const child1 = makeResource('C1', 'Child One');
      const child2 = makeResource('C2', 'Child Two');
      const parent = makeResource(
        'P',
        'Parent',
        // intentionally unordered
        [child1, child2],
      );

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(child2.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [parent],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((item) => item.resource.id)).to.deep.equal(['P', 'C1', 'C2']);
      expect(response[2].occurrences).to.have.length(1);
      expect(response[2].occurrences[0].id).to.equal(event.id);
    });

    it('should return an empty occurrences list when visibleResources marks the resource as false', () => {
      const R1 = makeResource('R1', 'Resource 1');

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(R1.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [R1],
      });
      // TODO: Use props.defaultVisibleResources when available
      state.visibleResources = { [R1.id]: false };
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(0);
    });

    it('should handle deep nested resource trees', () => {
      const c = makeResource('C', 'C');
      const b = makeResource('B', 'B', [c]);
      const a = makeResource('A', 'A', [b]);
      const root = makeResource('R', 'Root', [a]);

      const event = EventBuilder.new()
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .resource(c.id)
        .build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [root],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response.map((r) => r.resource.id)).to.deep.equal(['R', 'A', 'B', 'C']);
      expect(response[3].occurrences[0].id).to.equal(event.id);
    });

    it('should leave occurrences empty when events fall outside the date range', () => {
      const R1 = makeResource('R1', 'Resource 1');

      const event = EventBuilder.new().singleDay('2024-03-01T09:00:00Z').resource(R1.id).build();

      const state = getEventTimelinePremiumStateFromParameters({
        events: [event],
        resources: [R1],
      });
      const response = schedulerOccurrenceSelectors.groupedByResourceList(state, start, end);

      expect(response[0].occurrences).to.have.length(0);
    });
  });
});
