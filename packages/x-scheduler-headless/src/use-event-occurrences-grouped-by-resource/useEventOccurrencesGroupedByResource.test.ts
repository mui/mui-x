import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import { innerGetEventOccurrencesGroupedByResource } from './useEventOccurrencesGroupedByResource';
import { SchedulerResource, SchedulerProcessedEvent } from '../models';

describe('innerGetEventOccurrencesGroupedByResource', () => {
  const startString = DEFAULT_TESTING_VISIBLE_DATE_STR;
  const start = DEFAULT_TESTING_VISIBLE_DATE;
  const end = adapter.addDays(start, 2);

  const makeResource = (id: string, title: string): SchedulerResource => ({
    id,
    title,
  });

  function call(options: {
    events?: SchedulerProcessedEvent[];
    resources?: SchedulerResource[];
    visibleResources?: Map<string, boolean>;
    resourcesChildrenMap?: Map<string, readonly SchedulerResource[]>;
    resourceParentIds?: Map<string, string | null>;
  }) {
    return innerGetEventOccurrencesGroupedByResource(
      adapter,
      options.events ?? [],
      options.visibleResources ?? new Map(),
      options.resources ?? [],
      options.resourcesChildrenMap ?? new Map(),
      options.resourceParentIds ?? new Map(),
      start,
      end,
    );
  }

  it('should return empty when there are no resources', () => {
    const out = call({ resources: [] });
    expect(out).to.have.length(0);
  });

  it('should group single occurrence under a resource', () => {
    const R1 = makeResource('R1', 'Resource 1');

    const occurrence = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();

    const out = call({
      events: [occurrence],
      resources: [R1],
      visibleResources: new Map([[R1.id, true]]),
    });

    expect(out).to.have.length(1);
    expect(out[0].resource.id).to.equal(R1.id);
    expect(out[0].occurrences).to.have.length(1);
    expect(out[0].occurrences[0].id).to.equal(occurrence.id);
  });

  it('should return empty occurrences for resources without matching events', () => {
    const R1 = makeResource('R1', 'Resource 1');
    const R2 = makeResource('R2', 'Resource 2');

    const occurrence = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();

    const out = call({
      events: [occurrence],
      resources: [R1, R2],
      visibleResources: new Map([
        [R1.id, true],
        [R2.id, true],
      ]),
    });

    expect(out[0].occurrences).to.have.length(1);
    expect(out[1].occurrences).to.have.length(0);
  });

  it('should sort resources alphabetically by title', () => {
    const R1 = makeResource('Z', 'Zoo');
    const R2 = makeResource('A', 'Alpha');
    const R3 = makeResource('M', 'Moon');

    const out = call({
      resources: [R1, R3, R2],
      visibleResources: new Map([
        ['Z', true],
        ['A', true],
        ['M', true],
      ]),
    });

    expect(out.map((item) => item.resource.title)).to.deep.equal(['Alpha', 'Moon', 'Zoo']);
  });

  it('should group multiple occurrences under the same resource', () => {
    const R1 = makeResource('R1', 'Alpha');

    const occurrence1 = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();
    const occurrence2 = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();

    const out = call({
      events: [occurrence1, occurrence2],
      resources: [R1],
      visibleResources: new Map([[R1.id, true]]),
    });

    expect(out[0].occurrences).to.have.length(2);
    expect(out[0].occurrences[0].id).to.equal(occurrence1.id);
    expect(out[0].occurrences[1].id).to.equal(occurrence2.id);
  });

  it('should ignore occurrences that have no resource id', () => {
    const R1 = makeResource('R1', 'Resource 1');

    const occurrence1 = EventBuilder.new().singleDay(startString).buildOccurrence();
    const occurrence2 = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();

    const out = call({
      events: [occurrence1, occurrence2],
      resources: [R1],
      visibleResources: new Map([[R1.id, true]]),
    });

    expect(out[0].occurrences).to.have.length(1);
    expect(out[0].occurrences[0].id).to.equal(occurrence2.id);
  });

  it('should include children immediately after their parent', () => {
    const parent = makeResource('P', 'Parent');
    const child1 = makeResource('C1', 'Child One');
    const child2 = makeResource('C2', 'Child Two');

    const occurrence = EventBuilder.new()
      .singleDay(startString)
      .resource(child2.id)
      .buildOccurrence();

    const children = new Map<string, readonly SchedulerResource[]>([
      ['P', [child2, child1]], // intentionally unordered
    ]);

    const parents = new Map<string, string | null>([
      ['C1', 'P'],
      ['C2', 'P'],
    ]);

    const out = call({
      events: [occurrence],
      resources: [parent],
      visibleResources: new Map([
        ['P', true],
        ['C1', true],
        ['C2', true],
      ]),
      resourcesChildrenMap: children,
      resourceParentIds: parents,
    });

    expect(out.map((item) => item.resource.id)).to.deep.equal(['P', 'C1', 'C2']);
    expect(out[2].occurrences).to.have.length(1);
    expect(out[2].occurrences[0].id).to.equal(occurrence.id);
  });

  it('should return an empty occurrences list when visibleResources marks the resource as false', () => {
    const R1 = makeResource('R1', 'Resource 1');

    const occurrence = EventBuilder.new().singleDay(startString).resource(R1.id).buildOccurrence();

    const out = call({
      events: [occurrence],
      resources: [R1],
      visibleResources: new Map([[R1.id, false]]),
    });

    expect(out[0].occurrences).to.have.length(0);
  });

  it('should handle deep nested resource trees', () => {
    const root = makeResource('R', 'Root');
    const a = makeResource('A', 'A');
    const b = makeResource('B', 'B');
    const c = makeResource('C', 'C');

    const children = new Map<string, readonly SchedulerResource[]>([
      ['R', [a]],
      ['A', [b]],
      ['B', [c]],
    ]);

    const parents = new Map<string, string | null>([
      ['A', 'R'],
      ['B', 'A'],
      ['C', 'B'],
    ]);

    const occurrence = EventBuilder.new().singleDay(startString).resource(c.id).buildOccurrence();

    const out = call({
      events: [occurrence],
      resources: [root],
      visibleResources: new Map([
        ['R', true],
        ['A', true],
        ['B', true],
        ['C', true],
      ]),
      resourcesChildrenMap: children,
      resourceParentIds: parents,
    });

    expect(out.map((r) => r.resource.id)).to.deep.equal(['R', 'A', 'B', 'C']);
    expect(out[3].occurrences[0].id).to.equal(occurrence.id);
  });

  it('should leave occurrences empty when events fall outside the date range', () => {
    const R1 = makeResource('R1', 'Resource 1');

    const occurrence = EventBuilder.new()
      .singleDay('2024-03-01T09:00:00Z')
      .resource(R1.id)
      .buildOccurrence();

    const out = call({
      events: [occurrence],
      resources: [R1],
      visibleResources: new Map([[R1.id, true]]),
    });

    expect(out[0].occurrences).to.have.length(0);
  });
});
