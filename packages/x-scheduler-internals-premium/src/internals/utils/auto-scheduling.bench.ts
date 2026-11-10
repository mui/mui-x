import { describe, test } from 'vitest';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import type { SchedulerDependency } from '../../models';
import { groupByEventId } from './dependency-utils';
import { computeAutoSchedulingCascade } from './auto-scheduling';

export const benchmarkResult = { value: undefined as unknown };

describe.each([
  ['default', false],
  ['America/New_York', false],
  ['America/New_York', true],
] as const)('data timezone %s, all-day %s', (timezone, allDay) => {
  // A chain of 300 tasks, each finishing one day before the next starts.
  const count = 300;
  const events = Array.from({ length: count }, (_, index) => {
    const builder = EventBuilder.new().id(index);
    const withTimezone = timezone === 'default' ? builder : builder.withDataTimezone(timezone);
    if (allDay) {
      // Every other day: the next task starts right after the lag.
      const day = new Date(Date.UTC(2026, 0, 5) + index * 2 * 86_400_000)
        .toISOString()
        .slice(0, 10);
      return withTimezone
        .span(`${day}T00:00:00`, `${day}T23:59:59.999`, { allDay: true })
        .toProcessed();
    }
    // 8-hour tasks, each starting one day after the previous one ends.
    const start = new Date(Date.UTC(2026, 0, 5, 9) + index * 32 * 3_600_000);
    const end = new Date(start.getTime() + 8 * 3_600_000);
    return withTimezone
      .span(start.toISOString().slice(0, 19), end.toISOString().slice(0, 19))
      .toProcessed();
  });
  const dependencies: SchedulerDependency[] = events.slice(1).map((event, index) => ({
    id: `dep-${index}`,
    source: index,
    target: index + 1,
    type: 'FinishToStart',
    lag: 1,
    lagUnit: 'day',
  }));
  const parameters = {
    adapter,
    processedEventLookup: new Map(events.map((event) => [event.id, event])),
    activeDependenciesBySource: groupByEventId(dependencies, 'source'),
    activeDependenciesByTarget: groupByEventId(dependencies, 'target'),
    isEventReadOnly: () => false,
    deleted: new Set<number>(),
    // Moving the first task 3 days later pushes the whole chain.
    updated: [
      {
        id: 0,
        start: adapter.addDays(events[0].dataTimezone.start.value, 3),
        end: adapter.addDays(events[0].dataTimezone.end.value, 3),
      },
    ],
  };

  test('push a chain of 300 tasks', { timeout: 0 }, async ({ bench }) => {
    await bench('cascade', () => {
      benchmarkResult.value = computeAutoSchedulingCascade(parameters);
    }).run();
  });
});
